"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, ImageUp, Loader2, Plus, Save, Trash2, TriangleAlert } from "lucide-react";
import { emptyObject, resolveOptions, type Errors, type Field, type ResolvedOptions } from "@/lib/admin/fields";
import { saveDocument, saveSingleton, uploadImage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, toFaNumber } from "@/lib/utils";

type Target = { kind: "singleton"; key: string } | { kind: "collection"; key: string; id: string | null };
type Value = Record<string, unknown>;

type ContentFormProps = {
  target: Target;
  fields: Field[];
  initial?: Value;
  options: ResolvedOptions;
  /** Fields shown read-only (e.g. the slug of an existing document). */
  locked?: string[];
};

/** Renders and saves any content section from its field schema. */
export function ContentForm({ target, fields, initial, options, locked = [] }: ContentFormProps) {
  const router = useRouter();
  const [value, setValue] = useState<Value>(() => initial ?? emptyObject(fields));
  const [saved, setSaved] = useState(() => JSON.stringify(initial ?? emptyObject(fields)));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const dirty = JSON.stringify(value) !== saved;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Ctrl/Cmd + S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const result =
        target.kind === "singleton"
          ? await saveSingleton(target.key, value)
          : await saveDocument(target.key, target.id, value);

      if (!result.ok) {
        setErrors(result.errors);
        setStatus({ type: "error", text: result.message ?? "ذخیره نشد." });
        requestAnimationFrame(() =>
          formRef.current?.querySelector("[aria-invalid=true]")?.scrollIntoView({ behavior: "smooth", block: "center" }),
        );
        return;
      }
      setErrors({});
      setSaved(JSON.stringify(value));
      setStatus({ type: "ok", text: "ذخیره شد و روی سایت اعمال شد." });
      if (target.kind === "collection" && !target.id && result.id) {
        router.replace(`/admin/${target.key}/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="pb-28">
      <FieldGrid
        fields={fields}
        value={value}
        onChange={setValue}
        path=""
        errors={errors}
        options={options}
        locked={locked}
      />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur lg:start-64">
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-8">
          <Button type="submit" disabled={pending || (!dirty && target.kind === "singleton")}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            {pending ? "در حال ذخیره…" : "ذخیره"}
          </Button>
          <span className="text-sm" role="status">
            {status?.type === "ok" && !dirty && (
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Check className="size-4" /> {status.text}
              </span>
            )}
            {status?.type === "error" && (
              <span className="inline-flex items-center gap-1.5 text-destructive">
                <TriangleAlert className="size-4" />
                {status.text}
                {errorCount > 0 && ` (${toFaNumber(errorCount)} مورد)`}
              </span>
            )}
            {dirty && status?.type !== "error" && <span className="text-muted-foreground">تغییرات ذخیره نشده دارید.</span>}
          </span>
          <span className="ms-auto hidden text-xs text-muted-foreground sm:block" dir="ltr">
            Ctrl + S
          </span>
        </div>
      </div>
    </form>
  );
}

/* ---------- Field rendering ---------- */

type FieldProps<T = unknown> = {
  field: Field;
  value: T;
  onChange: (value: T) => void;
  path: string;
  errors: Errors;
  options: ResolvedOptions;
  locked: string[];
};

function FieldGrid({
  fields,
  value,
  onChange,
  path,
  errors,
  options,
  locked,
}: {
  fields: Field[];
  value: Value;
  onChange: (value: Value) => void;
  path: string;
  errors: Errors;
  options: ResolvedOptions;
  locked: string[];
}) {
  return (
    <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={cn(
            (field.wide || field.type === "list" || field.type === "group" || field.type === "image") && "md:col-span-2",
          )}
        >
          <FieldControl
            field={field}
            value={value[field.name]}
            onChange={(v) => onChange({ ...value, [field.name]: v })}
            path={path + field.name}
            errors={errors}
            options={options}
            locked={path === "" ? locked : []}
          />
        </div>
      ))}
    </div>
  );
}

function FieldShell({
  field,
  path,
  error,
  children,
}: {
  field: Field;
  path: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = `f-${path}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {field.help && !error && <p className="text-xs leading-6 text-muted-foreground">{field.help}</p>}
      {error && (
        <p className="text-xs text-destructive" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

const selectClass =
  "h-12 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-invalid:border-destructive md:text-sm";

function FieldControl(props: FieldProps) {
  const { field, value, onChange, path, errors, options, locked } = props;
  const error = errors[path];
  const id = `f-${path}`;
  const a11y = {
    id,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  const isLocked = locked.includes(field.name);

  switch (field.type) {
    case "text":
    case "slug":
    case "url":
    case "email":
    case "date":
      return (
        <FieldShell field={field} path={path} error={error}>
          <Input
            {...a11y}
            type={field.type === "url" ? "url" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
            dir={field.type === "text" ? field.dir : "ltr"}
            placeholder={"placeholder" in field ? field.placeholder : undefined}
            value={String(value ?? "")}
            readOnly={isLocked}
            className={cn(isLocked && "cursor-not-allowed opacity-60")}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      );

    case "textarea":
      return (
        <FieldShell field={field} path={path} error={error}>
          <Textarea
            {...a11y}
            rows={field.rows ?? 4}
            className="min-h-0"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      );

    case "number":
      return (
        <FieldShell field={field} path={path} error={error}>
          <Input
            {...a11y}
            type="number"
            dir="ltr"
            inputMode="decimal"
            min={field.min}
            max={field.max}
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </FieldShell>
      );

    case "color":
      return (
        <FieldShell field={field} path={path} error={error}>
          <div className="flex items-center gap-3">
            <input
              type="color"
              aria-label={field.label}
              value={/^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-12 w-16 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
            />
            <Input {...a11y} dir="ltr" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          </div>
        </FieldShell>
      );

    case "select": {
      const opts = resolveOptions(field.options, options);
      return (
        <FieldShell field={field} path={path} error={error}>
          <select {...a11y} className={selectClass} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            <option value="">{field.required ? "انتخاب کنید…" : "— هیچ‌کدام —"}</option>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );
    }

    case "multiselect": {
      const opts = resolveOptions(field.options, options);
      const selected = new Set(Array.isArray(value) ? (value as string[]) : []);
      return (
        <FieldShell field={field} path={path} error={error}>
          <div id={id} className="flex flex-wrap gap-2">
            {opts.map((o) => {
              const on = selected.has(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const next = new Set(selected);
                    if (on) next.delete(o.value);
                    else next.add(o.value);
                    onChange(opts.map((x) => x.value).filter((v) => next.has(v)));
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                    on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {on && <Check className="size-3.5" />}
                  {o.label}
                </button>
              );
            })}
            {opts.length === 0 && <span className="text-sm text-muted-foreground">گزینه‌ای وجود ندارد.</span>}
          </div>
        </FieldShell>
      );
    }

    case "paragraphs":
      return <ParagraphsField {...props} value={value as string[]} onChange={onChange} />;

    case "image":
      return <ImageField {...props} value={value as ImageValue | undefined} onChange={onChange} />;

    case "strings":
      return <StringsField {...props} value={value as string[]} onChange={onChange} />;

    case "list":
      return <ListField {...props} value={value as Value[]} onChange={onChange} />;

    case "group":
      return (
        <fieldset className="rounded-xl border border-border bg-card/30 p-5 sm:p-6">
          <legend className="px-2 text-sm font-bold">{field.label}</legend>
          <FieldGrid
            fields={field.fields}
            value={(value as Value) ?? {}}
            onChange={onChange}
            path={`${path}.`}
            errors={errors}
            options={options}
            locked={[]}
          />
        </fieldset>
      );
  }
}

function ParagraphsField({ field, value, onChange, path, errors }: FieldProps<string[]>) {
  // Keep the raw text locally so typing blank lines isn't normalised away mid-edit.
  const [text, setText] = useState(() => (value ?? []).join("\n\n"));
  const error = errors[path];
  return (
    <FieldShell field={field} path={path} error={error}>
      <Textarea
        id={`f-${path}`}
        aria-invalid={!!error || undefined}
        rows={8}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          );
        }}
      />
    </FieldShell>
  );
}

type ImageValue = { src: string; width: number; height: number };

function ImageField({ field, value, onChange, path, errors }: FieldProps<ImageValue | undefined>) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = uploadError ?? errors[path];

  async function upload(file: File) {
    setUploading(true);
    setUploadError(null);
    const data = new FormData();
    data.set("file", file);
    try {
      const result = await uploadImage(data);
      if (result.ok) onChange(result.image);
      else setUploadError(result.message);
    } catch {
      setUploadError("بارگذاری انجام نشد. حجم فایل را بررسی کنید.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <FieldShell field={field} path={path} error={error}>
      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl border border-dashed p-4 sm:flex-row sm:items-center",
          error ? "border-destructive" : "border-input",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        <div className="h-48 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-black/30 sm:w-72">
          {value?.src ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary upload
            <img src={value.src} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">بدون تصویر</div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {value?.src && (
            <span className="text-xs text-muted-foreground" dir="ltr">
              {value.width} × {value.height}px
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? <Loader2 className="animate-spin" /> : <ImageUp />}
              {uploading ? "در حال بارگذاری…" : value?.src ? "جایگزینی تصویر" : "بارگذاری تصویر"}
            </Button>
            {value?.src && !field.required && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
                <Trash2 /> حذف
              </Button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">JPG، PNG، WebP یا AVIF تا ۱۰ مگابایت. می‌توانید فایل را اینجا رها کنید.</span>
          <input
            ref={inputRef}
            id={`f-${path}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </div>
      </div>
    </FieldShell>
  );
}

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function ItemControls({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (d: number) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button type="button" variant="ghost" size="icon" className="size-9" disabled={index === 0} onClick={() => onMove(-1)} aria-label="انتقال به بالا">
        <ArrowUp />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-9" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="انتقال به پایین">
        <ArrowDown />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-9 hover:text-destructive" onClick={onRemove} aria-label="حذف">
        <Trash2 />
      </Button>
    </div>
  );
}

function StringsField({ field, value, onChange, path, errors }: FieldProps<string[]>) {
  const list = Array.isArray(value) ? value : [];
  const itemLabel = field.type === "strings" ? field.itemLabel : "";
  return (
    <FieldShell field={field} path={path} error={errors[path]}>
      <div className="flex flex-col gap-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              id={i === 0 ? `f-${path}` : undefined}
              aria-label={`${itemLabel} ${toFaNumber(i + 1)}`}
              value={item}
              onChange={(e) => onChange(list.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <ItemControls
              index={i}
              count={list.length}
              onMove={(d) => onChange(move(list, i, d))}
              onRemove={() => onChange(list.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange([...list, ""])}>
          <Plus /> افزودن {itemLabel}
        </Button>
      </div>
    </FieldShell>
  );
}

function ListField({ field, value, onChange, path, errors, options }: FieldProps<Value[]>) {
  if (field.type !== "list") return null;
  const list = Array.isArray(value) ? value : [];
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-2 text-sm font-medium">
        {field.label} <span className="text-muted-foreground">({toFaNumber(list.length)})</span>
      </legend>
      {field.help && <p className="-mt-2 text-xs text-muted-foreground">{field.help}</p>}
      {errors[path] && <p className="text-xs text-destructive">{errors[path]}</p>}
      {list.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-card/30 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-muted-foreground">
              {field.itemLabel} {toFaNumber(i + 1)}
            </span>
            <ItemControls
              index={i}
              count={list.length}
              onMove={(d) => onChange(move(list, i, d))}
              onRemove={() => onChange(list.filter((_, j) => j !== i))}
            />
          </div>
          <FieldGrid
            fields={field.fields}
            value={item}
            onChange={(v) => onChange(list.map((x, j) => (j === i ? v : x)))}
            path={`${path}.${i}.`}
            errors={errors}
            options={options}
            locked={[]}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => onChange([...list, emptyObject(field.fields)])}
      >
        <Plus /> افزودن {field.itemLabel}
      </Button>
    </fieldset>
  );
}

