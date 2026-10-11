"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validate, type Errors } from "@/lib/admin/fields";
import { getSection, type CollectionSection, type SingletonSection } from "@/lib/admin/sections";
import { loadOptions } from "@/lib/admin/options";
import {
  createUser,
  deleteUser,
  endSession,
  listUsers,
  passwordMatches,
  PASSWORD_MIN,
  requireAdmin,
  setPassword,
  startSession,
  usernameTaken,
} from "@/lib/server/auth";
import { removeResume, saveImage, UserError } from "@/lib/server/files";
import {
  deleteApplication,
  deleteDocument,
  deleteMessage,
  documentExists,
  getApplicationFile,
  moveDocument,
  setApplicationRead,
  setMessageRead,
  writeDocument,
  writeSingleton,
} from "@/lib/server/store";

export type SaveResult = { ok: true; id?: string } | { ok: false; errors: Errors; message?: string };

/** Content changed: regenerate every public page on its next request. */
function refreshSite() {
  revalidatePath("/", "layout");
}

const INVALID = "برخی فیلدها نیاز به اصلاح دارند.";

/* ---------- Content ---------- */

export async function saveSingleton(key: string, data: unknown): Promise<SaveResult> {
  await requireAdmin();
  const section = getSection(key);
  if (section?.kind !== "singleton") return { ok: false, errors: {}, message: "بخش نامعتبر است." };

  const { value, errors } = validate((section as SingletonSection).fields, data, await loadOptions());
  if (Object.keys(errors).length) return { ok: false, errors, message: INVALID };

  writeSingleton(key, value);
  refreshSite();
  return { ok: true };
}

/** Creates (id = null) or updates a document in a collection. */
export async function saveDocument(collection: string, id: string | null, data: unknown): Promise<SaveResult> {
  await requireAdmin();
  const section = getSection(collection);
  if (section?.kind !== "collection") return { ok: false, errors: {}, message: "بخش نامعتبر است." };
  const { idField, fields } = section as CollectionSection;

  const { value, errors } = validate(fields, data, await loadOptions());

  let docId = id;
  if (!docId) {
    docId = idField === "slug" ? String(value.slug ?? "") : crypto.randomUUID().slice(0, 8);
    if (docId === "new") errors.slug = "این نامک رزرو شده است.";
    else if (docId && documentExists(collection, docId)) errors.slug = "این نامک قبلاً استفاده شده است.";
  } else if (!documentExists(collection, docId)) {
    return { ok: false, errors: {}, message: "این مورد پیدا نشد؛ ممکن است حذف شده باشد." };
  }
  if (Object.keys(errors).length) return { ok: false, errors, message: INVALID };

  // The id is fixed once created; keep it in the document too.
  if (idField === "slug") value.slug = docId;
  else value.id = docId;

  writeDocument(collection, docId!, value);
  refreshSite();
  return { ok: true, id: docId! };
}

export async function removeDocument(collection: string, id: string) {
  await requireAdmin();
  if (getSection(collection)?.kind !== "collection") return;
  deleteDocument(collection, id);
  refreshSite();
  redirect(`/admin/${collection}`);
}

export async function reorderDocument(collection: string, id: string, direction: "up" | "down") {
  await requireAdmin();
  if (getSection(collection)?.kind !== "collection") return;
  moveDocument(collection, id, direction);
  refreshSite();
}

export async function uploadImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, message: "فایلی انتخاب نشده است." };
  try {
    return { ok: true as const, image: await saveImage(file) };
  } catch (error) {
    if (error instanceof UserError) return { ok: false as const, message: error.message };
    throw error;
  }
}

/* ---------- Inbox ---------- */

export async function markMessage(id: number, read: boolean) {
  await requireAdmin();
  setMessageRead(id, read);
  revalidatePath("/admin", "layout");
}

export async function removeMessage(id: number) {
  await requireAdmin();
  deleteMessage(id);
  revalidatePath("/admin", "layout");
}

export async function markApplication(id: number, read: boolean) {
  await requireAdmin();
  setApplicationRead(id, read);
  revalidatePath("/admin", "layout");
}

export async function removeApplication(id: number) {
  await requireAdmin();
  const file = getApplicationFile(id);
  deleteApplication(id);
  if (file) await removeResume(file.file);
  revalidatePath("/admin", "layout");
}

/* ---------- Admin users ---------- */

export type FormState = { ok?: boolean; message?: string };

const USERNAME = /^[a-zA-Z0-9_.-]{3,32}$/;

export async function addUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!USERNAME.test(username)) return { message: "نام کاربری: ۳ تا ۳۲ حرف انگلیسی، عدد، نقطه، خط تیره یا زیرخط." };
  if (password.length < PASSWORD_MIN) return { message: `رمز عبور باید دست‌کم ${PASSWORD_MIN} کاراکتر باشد.` };
  if (usernameTaken(username)) return { message: "این نام کاربری قبلاً ثبت شده است." };
  createUser(username, password);
  revalidatePath("/admin/users");
  return { ok: true, message: `کاربر «${username}» ساخته شد.` };
}

export async function removeUser(id: number) {
  const me = await requireAdmin();
  if (id === me.id || listUsers().length <= 1) return;
  deleteUser(id);
  revalidatePath("/admin/users");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!passwordMatches(me.id, current)) return { message: "رمز عبور فعلی درست نیست." };
  if (next.length < PASSWORD_MIN) return { message: `رمز عبور جدید باید دست‌کم ${PASSWORD_MIN} کاراکتر باشد.` };
  if (next !== confirm) return { message: "تکرار رمز عبور با رمز جدید یکسان نیست." };
  setPassword(me.id, next);
  await startSession(me.id); // other sessions were signed out; keep this one
  return { ok: true, message: "رمز عبور تغییر کرد. سایر نشست‌ها خارج شدند." };
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
