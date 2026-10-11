#!/usr/bin/env node
/**
 * Sets an admin's password from the server's command line (creates the
 * account if it doesn't exist). For when nobody can sign in any more.
 *
 *   npm run admin:password -- <username> <new-password>
 */
import crypto from "node:crypto";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const [username, password] = process.argv.slice(2);
if (!username || !password || password.length < 8) {
  console.error("Usage: npm run admin:password -- <username> <new-password (8+ chars)>");
  process.exit(1);
}

const storage = path.resolve(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
const db = new DatabaseSync(path.join(storage, "holding.db"));
db.exec("PRAGMA busy_timeout = 10000");

const salt = crypto.randomBytes(16);
const hash = `scrypt$${salt.toString("hex")}$${crypto.scryptSync(password, salt, 64).toString("hex")}`;

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
if (existing) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, existing.id);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(existing.id);
  console.log(`Password updated for "${username}".`);
} else {
  db.prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)").run(username, hash, new Date().toISOString());
  console.log(`Admin "${username}" created.`);
}
