import fs from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/server/db";

const NAME = /^[0-9a-f-]{36}\.webp$/;

/** Serves images uploaded from the admin panel (names are random and never reused, so cache forever). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!NAME.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(uploadsDir, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
