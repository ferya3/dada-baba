import "server-only";
import { db, transaction } from "./db";
import type { ContactMessage, JobApplication } from "@/lib/content/types";

/* ---------- Content: singletons (settings, home, pages, about) ---------- */

export function readSingleton<T>(key: string): T {
  const row = db().prepare("SELECT data FROM singletons WHERE key = ?").get(key) as { data: string } | undefined;
  if (!row) throw new Error(`Missing singleton "${key}"`);
  return JSON.parse(row.data) as T;
}

export function writeSingleton(key: string, data: unknown) {
  db()
    .prepare(
      `INSERT INTO singletons (key, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .run(key, JSON.stringify(data), new Date().toISOString());
}

/* ---------- Content: ordered collections (subsidiaries, news, ...) ---------- */

export function listDocuments<T>(collection: string): T[] {
  const rows = db()
    .prepare("SELECT data FROM documents WHERE collection = ? ORDER BY position, id")
    .all(collection) as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as T);
}

export function readDocument<T>(collection: string, id: string): T | null {
  const row = db().prepare("SELECT data FROM documents WHERE collection = ? AND id = ?").get(collection, id) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as T) : null;
}

export function documentExists(collection: string, id: string) {
  return !!db().prepare("SELECT 1 FROM documents WHERE collection = ? AND id = ?").get(collection, id);
}

/** Inserts (appended at the end) or updates a document. */
export function writeDocument(collection: string, id: string, data: unknown) {
  const now = new Date().toISOString();
  transaction(() => {
    const updated = db()
      .prepare("UPDATE documents SET data = ?, updated_at = ? WHERE collection = ? AND id = ?")
      .run(JSON.stringify(data), now, collection, id);
    if (updated.changes === 0) {
      const { next } = db()
        .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM documents WHERE collection = ?")
        .get(collection) as { next: number };
      db()
        .prepare("INSERT INTO documents (collection, id, position, data, updated_at) VALUES (?, ?, ?, ?, ?)")
        .run(collection, id, next, JSON.stringify(data), now);
    }
  });
}

export function deleteDocument(collection: string, id: string) {
  db().prepare("DELETE FROM documents WHERE collection = ? AND id = ?").run(collection, id);
}

/** Swaps a document with its neighbour to move it up or down the list. */
export function moveDocument(collection: string, id: string, direction: "up" | "down") {
  transaction(() => {
    const rows = db()
      .prepare("SELECT id FROM documents WHERE collection = ? ORDER BY position, id")
      .all(collection) as { id: string }[];
    const index = rows.findIndex((r) => r.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= rows.length) return;
    [rows[index], rows[target]] = [rows[target], rows[index]];
    const set = db().prepare("UPDATE documents SET position = ? WHERE collection = ? AND id = ?");
    rows.forEach((r, i) => set.run(i, collection, r.id));
  });
}

export function countDocuments(collection: string) {
  const { n } = db().prepare("SELECT COUNT(*) AS n FROM documents WHERE collection = ?").get(collection) as {
    n: number;
  };
  return n;
}

/* ---------- Contact messages ---------- */

type MessageRow = {
  id: number;
  name: string;
  email: string;
  company: string;
  subsidiary: string;
  message: string;
  created_at: string;
  read: number;
};

export function addMessage(m: Pick<ContactMessage, "name" | "email" | "company" | "subsidiary" | "message">) {
  db()
    .prepare(
      "INSERT INTO messages (name, email, company, subsidiary, message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(m.name, m.email, m.company, m.subsidiary, m.message, new Date().toISOString());
}

export function listMessages(): ContactMessage[] {
  const rows = db().prepare("SELECT * FROM messages ORDER BY id DESC").all() as MessageRow[];
  return rows.map(({ created_at, read, ...r }) => ({ ...r, createdAt: created_at, read: !!read }));
}

export function setMessageRead(id: number, read: boolean) {
  db().prepare("UPDATE messages SET read = ? WHERE id = ?").run(read ? 1 : 0, id);
}

export function deleteMessage(id: number) {
  db().prepare("DELETE FROM messages WHERE id = ?").run(id);
}

/* ---------- Job applications ---------- */

type ApplicationRow = {
  id: number;
  job_id: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  resume_file: string;
  resume_name: string;
  created_at: string;
  read: number;
};

function toApplication(r: ApplicationRow): JobApplication {
  return {
    id: r.id,
    jobId: r.job_id,
    jobTitle: r.job_title,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    resumeName: r.resume_name,
    createdAt: r.created_at,
    read: !!r.read,
  };
}

export function addApplication(a: {
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  resumeFile: string;
  resumeName: string;
}) {
  db()
    .prepare(
      `INSERT INTO applications (job_id, job_title, name, email, phone, message, resume_file, resume_name, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(a.jobId, a.jobTitle, a.name, a.email, a.phone, a.message, a.resumeFile, a.resumeName, new Date().toISOString());
}

export function listApplications(): JobApplication[] {
  const rows = db().prepare("SELECT * FROM applications ORDER BY id DESC").all() as ApplicationRow[];
  return rows.map(toApplication);
}

/** Stored file name + original name of an application's resume. */
export function getApplicationFile(id: number) {
  return db().prepare("SELECT resume_file AS file, resume_name AS name FROM applications WHERE id = ?").get(id) as
    | { file: string; name: string }
    | undefined;
}

export function setApplicationRead(id: number, read: boolean) {
  db().prepare("UPDATE applications SET read = ? WHERE id = ?").run(read ? 1 : 0, id);
}

export function deleteApplication(id: number) {
  db().prepare("DELETE FROM applications WHERE id = ?").run(id);
}

export function inboxCounts() {
  return db()
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM messages) AS messages,
        (SELECT COUNT(*) FROM messages WHERE read = 0) AS unreadMessages,
        (SELECT COUNT(*) FROM applications) AS applications,
        (SELECT COUNT(*) FROM applications WHERE read = 0) AS unreadApplications`,
    )
    .get() as { messages: number; unreadMessages: number; applications: number; unreadApplications: number };
}
