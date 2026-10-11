/*
 * Schema-driven content editing. Each admin section describes its fields
 * once; the same description renders the form (client) and validates what
 * is saved (server). No server-only imports here — it runs on both sides.
 */

export type Option = { value: string; label: string };

/** Options filled in at request time (e.g. the current list of subsidiaries). */
export type OptionSource = "subsidiaries";

type Base = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Spans the full row in two-column layouts. */
  wide?: boolean;
};

export type Field =
  | (Base & { type: "text"; max?: number; dir?: "ltr"; placeholder?: string })
  | (Base & { type: "textarea"; max?: number; rows?: number })
  | (Base & { type: "slug"; placeholder?: string })
  | (Base & { type: "url"; placeholder?: string })
  | (Base & { type: "email" })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "color" })
  | (Base & { type: "date" })
  | (Base & { type: "select"; options: Option[] | OptionSource })
  | (Base & { type: "multiselect"; options: Option[] | OptionSource })
  | (Base & { type: "image" })
  | (Base & { type: "paragraphs" })
  | (Base & { type: "strings"; itemLabel: string })
  | (Base & { type: "list"; itemLabel: string; fields: Field[] })
  | (Base & { type: "group"; fields: Field[] });

export type Errors = Record<string, string>;
export type ResolvedOptions = Partial<Record<OptionSource, Option[]>>;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_SRC_PATTERN = /^\/(media|subsidiaries)\/[\w.-]+$/;
const MAX_ITEMS = 60;

export function resolveOptions(options: Option[] | OptionSource, resolved: ResolvedOptions): Option[] {
  return typeof options === "string" ? (resolved[options] ?? []) : options;
}

/** Empty value used when adding a new list item or creating a document. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "number":
      return undefined;
    case "color":
      return "#e0b25b";
    case "multiselect":
    case "paragraphs":
    case "strings":
    case "list":
      return [];
    case "group":
      return emptyObject(field.fields);
    case "image":
      return undefined;
    default:
      return "";
  }
}

export function emptyObject(fields: Field[]) {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

/**
 * Validates and normalises `input` against `fields`. Unknown keys are
 * dropped; empty optional values are omitted. Errors are keyed by dotted
 * path, e.g. "stats.0.label".
 */
export function validate(
  fields: Field[],
  input: unknown,
  options: ResolvedOptions,
  prefix = "",
): { value: Record<string, unknown>; errors: Errors } {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const value: Record<string, unknown> = {};
  const errors: Errors = {};

  for (const field of fields) {
    const path = prefix + field.name;
    const raw = source[field.name];
    const fail = (message: string) => (errors[path] = message);

    switch (field.type) {
      case "text":
      case "textarea":
      case "slug":
      case "url":
      case "email":
      case "color":
      case "date":
      case "select": {
        const v = str(raw);
        if (!v) {
          if (field.required) fail("این فیلد الزامی است.");
          break;
        }
        const max = field.type === "textarea" ? (field.max ?? 4000) : field.type === "text" ? (field.max ?? 300) : 500;
        if (v.length > max) fail(`حداکثر ${max} کاراکتر.`);
        else if (field.type === "slug" && !SLUG_PATTERN.test(v))
          fail("فقط حروف کوچک انگلیسی، عدد و خط تیره (مثلاً avand-energy).");
        else if (field.type === "url" && !/^https?:\/\/\S+$/i.test(v)) fail("آدرس باید با http:// یا https:// شروع شود.");
        else if (field.type === "email" && !EMAIL_PATTERN.test(v)) fail("ایمیل معتبر نیست.");
        else if (field.type === "color" && !COLOR_PATTERN.test(v)) fail("رنگ باید به شکل #RRGGBB باشد.");
        else if (field.type === "date" && (!DATE_PATTERN.test(v) || Number.isNaN(Date.parse(v)))) fail("تاریخ معتبر نیست.");
        else if (field.type === "select" && !resolveOptions(field.options, options).some((o) => o.value === v))
          fail("گزینه معتبر نیست.");
        else value[field.name] = v;
        break;
      }

      case "number": {
        if (raw === undefined || raw === null || raw === "") {
          if (field.required) fail("این فیلد الزامی است.");
          break;
        }
        const n = Number(raw);
        if (!Number.isFinite(n)) fail("عدد معتبر نیست.");
        else if (field.min !== undefined && n < field.min) fail(`حداقل ${field.min}.`);
        else if (field.max !== undefined && n > field.max) fail(`حداکثر ${field.max}.`);
        else value[field.name] = n;
        break;
      }

      case "multiselect": {
        const allowed = new Set(resolveOptions(field.options, options).map((o) => o.value));
        const list = Array.isArray(raw) ? [...new Set(raw.map(str))].filter((v) => allowed.has(v)) : [];
        if (field.required && list.length === 0) fail("دست‌کم یک گزینه را انتخاب کنید.");
        value[field.name] = list;
        break;
      }

      case "image": {
        const img = raw as { src?: unknown; width?: unknown; height?: unknown } | undefined;
        if (!img || !img.src) {
          if (field.required) fail("لطفاً تصویر را بارگذاری کنید.");
          break;
        }
        const src = str(img.src);
        const width = Number(img.width);
        const height = Number(img.height);
        if (!IMAGE_SRC_PATTERN.test(src) || !(width > 0) || !(height > 0)) fail("تصویر معتبر نیست.");
        else value[field.name] = { src, width: Math.round(width), height: Math.round(height) };
        break;
      }

      case "paragraphs":
      case "strings": {
        const list = (Array.isArray(raw) ? raw.map(str) : []).filter(Boolean);
        if (list.length > MAX_ITEMS) fail(`حداکثر ${MAX_ITEMS} مورد.`);
        else if (list.some((v) => v.length > 4000)) fail("یکی از موارد بیش از حد طولانی است.");
        else if (field.required && list.length === 0) fail("دست‌کم یک مورد لازم است.");
        else value[field.name] = list;
        break;
      }

      case "list": {
        const items = Array.isArray(raw) ? raw : [];
        if (items.length > MAX_ITEMS) {
          fail(`حداکثر ${MAX_ITEMS} مورد.`);
          break;
        }
        if (field.required && items.length === 0) fail("دست‌کم یک مورد لازم است.");
        value[field.name] = items.map((item, i) => {
          const result = validate(field.fields, item, options, `${path}.${i}.`);
          Object.assign(errors, result.errors);
          return result.value;
        });
        break;
      }

      case "group": {
        const result = validate(field.fields, raw, options, `${path}.`);
        Object.assign(errors, result.errors);
        value[field.name] = result.value;
        break;
      }
    }
  }

  return { value, errors };
}
