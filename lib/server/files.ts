import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";
import { resumesDir, uploadsDir } from "./db";
import type { Screenshot } from "@/lib/content/types";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/**
 * Stores an uploaded image. It is decoded and re-encoded as WebP, which both
 * validates it really is an image and strips anything embedded in it.
 * Very large images are scaled down to 2400px wide (tall full-page
 * screenshots keep their full height).
 */
export async function saveImage(file: File): Promise<Screenshot> {
  if (file.size > MAX_IMAGE_BYTES) throw new UserError("حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.");
  const input = Buffer.from(await file.arrayBuffer());
  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(input, { limitInputPixels: 80_000_000 })
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new UserError("فایل انتخاب‌شده تصویر معتبری نیست (JPG، PNG، WebP یا AVIF).");
  }
  const name = `${crypto.randomUUID()}.webp`;
  await fs.writeFile(path.join(uploadsDir, name), output.data);
  return { src: `/media/${name}`, width: output.info.width, height: output.info.height };
}

const RESUME_TYPES: { ext: string; magic: number[] }[] = [
  { ext: ".pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { ext: ".docx", magic: [0x50, 0x4b, 0x03, 0x04] }, // ZIP container
  { ext: ".doc", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE container
];

/** Stores a resume (PDF / Word) outside the public folders; returns the stored file name. */
export async function saveResume(file: File) {
  if (file.size === 0) throw new UserError("لطفاً فایل رزومه را انتخاب کنید.");
  if (file.size > MAX_RESUME_BYTES) throw new UserError("حجم رزومه نباید بیشتر از ۵ مگابایت باشد.");
  const ext = path.extname(file.name).toLowerCase();
  const type = RESUME_TYPES.find((t) => t.ext === ext);
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (!type || !type.magic.every((b, i) => head[i] === b)) {
    throw new UserError("فقط فایل PDF یا Word (doc / docx) پذیرفته می‌شود.");
  }
  const name = `${crypto.randomUUID()}${ext}`;
  await fs.writeFile(path.join(resumesDir, name), Buffer.from(await file.arrayBuffer()));
  return name;
}

export async function removeResume(name: string) {
  await fs.rm(path.join(resumesDir, path.basename(name)), { force: true });
}

/** An error whose message is safe to show to the person who caused it. */
export class UserError extends Error {}
