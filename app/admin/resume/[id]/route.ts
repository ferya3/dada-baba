import fs from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/server/auth";
import { resumesDir } from "@/lib/server/db";
import { getApplicationFile } from "@/lib/server/store";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Resume download — admins only; files live outside any public folder. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });

  const record = getApplicationFile(Number((await params).id));
  if (!record) return new Response("Not found", { status: 404 });

  const file = path.basename(record.file);
  let data: Buffer;
  try {
    data = await fs.readFile(path.join(resumesDir, file));
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const ext = path.extname(file).toLowerCase();
  const name = record.name.replace(/[\r\n"]/g, "") || `resume${ext}`;

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="resume${ext}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
