import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import * as seed from "@/lib/content/data";

/**
 * SQLite database (Node's built-in driver, no native packages to install).
 * Lives in STORAGE_DIR (default ./storage) together with uploaded files, so
 * backing up that one folder backs up the whole site.
 */
export const storageDir = path.resolve(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
export const uploadsDir = path.join(storageDir, "uploads");
export const resumesDir = path.join(storageDir, "resumes");

const SCHEMA_VERSION = 1;

function migrate(db: DatabaseSync) {
  const { user_version: version } = db.prepare("PRAGMA user_version").get() as { user_version: number };
  if (version >= SCHEMA_VERSION) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS singletons (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS documents (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      position INTEGER NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (collection, id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      subsidiary TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT NOT NULL DEFAULT '',
      job_title TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      resume_file TEXT NOT NULL,
      resume_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    PRAGMA user_version = ${SCHEMA_VERSION};
  `);
}

/** Fills an empty database with the sample content from lib/content/data.ts. */
function seedIfEmpty(db: DatabaseSync) {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM singletons").get() as { n: number };
  if (n > 0) return;

  const now = new Date().toISOString();
  const putSingleton = db.prepare("INSERT OR IGNORE INTO singletons (key, data, updated_at) VALUES (?, ?, ?)");
  const putDoc = db.prepare(
    "INSERT OR IGNORE INTO documents (collection, id, position, data, updated_at) VALUES (?, ?, ?, ?, ?)",
  );

  putSingleton.run("settings", JSON.stringify(seed.settings), now);
  putSingleton.run("home", JSON.stringify(seed.home), now);
  putSingleton.run("pages", JSON.stringify(seed.pages), now);
  putSingleton.run("about", JSON.stringify(seed.holding), now);

  const collections: [string, { slug?: string; id?: string }[]][] = [
    ["subsidiaries", seed.subsidiaries],
    ["services", seed.services],
    ["projects", seed.projects],
    ["news", seed.news],
    ["jobs", seed.jobs],
  ];
  for (const [collection, docs] of collections) {
    docs.forEach((doc, i) => putDoc.run(collection, doc.slug ?? doc.id!, i, JSON.stringify(doc), now));
  }
}

function open() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(resumesDir, { recursive: true });
  const db = new DatabaseSync(path.join(storageDir, "holding.db"));
  // Wait (rather than fail) while another process — e.g. a parallel build worker — holds the lock.
  db.exec("PRAGMA busy_timeout = 10000");
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  // IMMEDIATE takes the write lock up front, so parallel build workers can't seed twice.
  db.exec("BEGIN IMMEDIATE");
  try {
    migrate(db);
    seedIfEmpty(db);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return db;
}

const globalForDb = globalThis as unknown as { holdingDb?: DatabaseSync };

/** Shared connection (kept on globalThis so dev hot-reloads don't open new ones). */
export function db() {
  globalForDb.holdingDb ??= open();
  return globalForDb.holdingDb;
}

/** Runs `fn` inside a transaction. */
export function transaction<T>(fn: () => T): T {
  const conn = db();
  conn.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    conn.exec("COMMIT");
    return result;
  } catch (error) {
    conn.exec("ROLLBACK");
    throw error;
  }
}
