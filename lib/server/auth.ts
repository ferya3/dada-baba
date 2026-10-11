import "server-only";
import crypto from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteUrl } from "@/lib/site";
import { db } from "./db";

const COOKIE = "admin_session";
const SESSION_DAYS = 7;

export type AdminUser = { id: number; username: string; createdAt: string };

/* ---------- Passwords (scrypt) ---------- */

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

/** A hash to compare against when the username doesn't exist, so timing doesn't reveal valid usernames. */
const DUMMY_HASH = hashPassword(crypto.randomBytes(16).toString("hex"));

export const PASSWORD_MIN = 8;

/* ---------- Users ---------- */

export function userCount() {
  return (db().prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number }).n;
}

export function listUsers(): AdminUser[] {
  return (
    db().prepare("SELECT id, username, created_at FROM users ORDER BY id").all() as {
      id: number;
      username: string;
      created_at: string;
    }[]
  ).map((u) => ({ id: u.id, username: u.username, createdAt: u.created_at }));
}

export function createUser(username: string, password: string) {
  const result = db()
    .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)")
    .run(username, hashPassword(password), new Date().toISOString());
  return Number(result.lastInsertRowid);
}

export function usernameTaken(username: string) {
  return !!db().prepare("SELECT 1 FROM users WHERE username = ?").get(username);
}

export function deleteUser(id: number) {
  db().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function setPassword(userId: number, password: string) {
  db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), userId);
  // Signing in again is required everywhere else.
  db().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

export function checkCredentials(username: string, password: string): number | null {
  const row = db().prepare("SELECT id, password_hash FROM users WHERE username = ?").get(username) as
    | { id: number; password_hash: string }
    | undefined;
  const ok = verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  return row && ok ? row.id : null;
}

export function passwordMatches(userId: number, password: string) {
  const row = db().prepare("SELECT password_hash FROM users WHERE id = ?").get(userId) as
    | { password_hash: string }
    | undefined;
  return !!row && verifyPassword(password, row.password_hash);
}

/* ---------- Sessions ---------- */

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

async function isHttps() {
  const proto = (await headers()).get("x-forwarded-proto");
  return proto ? proto.split(",")[0].trim() === "https" : siteUrl.startsWith("https://");
}

export async function startSession(userId: number) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db().prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(sha256(token), userId, expires);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: await isHttps(),
    path: "/",
    expires: new Date(expires),
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  store.delete(COOKIE);
}

/** The signed-in admin for this request, or null. */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.id, u.username, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as { id: number; username: string; created_at: string } | undefined;
  return row ? { id: row.id, username: row.username, createdAt: row.created_at } : null;
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/* ---------- Login throttling ---------- */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const failures = new Map<string, { count: number; first: number }>();

export async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

export function isThrottled(key: string) {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(key: string) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else entry.count++;
}

export function clearFailures(key: string) {
  failures.delete(key);
}
