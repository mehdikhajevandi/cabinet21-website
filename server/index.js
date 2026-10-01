/**
 * Cabinet21 — Message server (no dependencies, plain Node.js)
 * ------------------------------------------------------------------
 * Stores the messages sent from the "Free consultation" form and
 * exposes a small password-protected API that the admin panel reads.
 *
 * Run:            node server/index.js        (or:  npm run server)
 * Environment:    PORT            (default 8787)
 *                 ADMIN_PASSWORD  (default 123456789reza)
 *                 DATA_DIR        (default ./server/data)
 *                 ALLOWED_ORIGINS (default * — comma separated list of origins)
 */

import http from "node:http";
import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/* Load .env (if present) — real environment variables always win. */
for (const envFile of [path.join(ROOT, ".env"), path.join(ROOT, ".env.production")]) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i.exec(line);
    if (!match) continue;
    const key = match[1];
    const value = match[2].replace(/^["']|["']$/g, "");
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const PORT = Number(process.env.PORT || 8787);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456789reza";
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "data");
const DIST_DIR = path.join(ROOT, "dist");
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_BODY_BYTES = 64 * 1024;

const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

mkdirSync(DATA_DIR, { recursive: true });

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

function readJson(file, fallback) {
  try {
    if (!existsSync(file)) return fallback;
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonAtomic(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  renameSync(tmp, file);
}

let messages = readJson(MESSAGES_FILE, []);
let sessions = readJson(SESSIONS_FILE, {});

function persistMessages() {
  writeJsonAtomic(MESSAGES_FILE, messages);
}

function persistSessions() {
  const now = Date.now();
  for (const [token, value] of Object.entries(sessions)) {
    if (value.expiresAt < now) delete sessions[token];
  }
  writeJsonAtomic(SESSIONS_FILE, sessions);
}

persistSessions();

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function corsHeaders(req) {
  const origin = req.headers.origin || "";
  const allowAll = ALLOWED_ORIGINS.includes("*");
  const allowed = allowAll || ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? (origin || "*") : "null",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function send(req, res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    ...corsHeaders(req),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const raw = await readBody(req);
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    throw Object.assign(new Error("invalid json"), { statusCode: 400 });
  }
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a), "utf8");
  const bufB = Buffer.from(String(b), "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const clean = (value, max) => String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);

/* Simple in-memory rate limiting (per IP). */
const hits = new Map();
function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return list.length <= limit;
}

/* Login throttling to slow down password guessing. */
const loginFails = new Map();
const LOGIN_MAX_FAILS = 6;
const LOGIN_LOCK_MS = 10 * 60 * 1000;

function authed(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const session = token ? sessions[token] : null;
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    delete sessions[token];
    persistSessions();
    return false;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Static site (so one server can host both the site and the API)      */
/* ------------------------------------------------------------------ */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function serveStatic(req, res, urlPath) {
  if (!existsSync(DIST_DIR)) {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders(req) });
    res.end("Cabinet21 API is running. Build the site first: npm run build\n");
    return;
  }

  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  let filePath = path.join(DIST_DIR, decoded);
  if (!filePath.startsWith(DIST_DIR)) filePath = path.join(DIST_DIR, "index.html");

  if (!existsSync(filePath) || !filePath.includes(".")) {
    // SPA fallback — /admin, /panel, ... all load the app.
    filePath = path.join(DIST_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
  });
  res.end(readFileSync(filePath));
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    res.writeHead(204, corsHeaders(req));
    res.end();
    return;
  }

  try {
    /* ---- public: save a message from the contact form ---- */
    if (pathname === "/api/messages" && method === "POST") {
      const ip = clientIp(req);
      if (!rateLimit(`msg:${ip}`, 6, 10 * 60 * 1000)) {
        return send(req, res, 429, { ok: false, error: "too_many_requests" });
      }

      const body = await readJsonBody(req);

      // Honeypot: bots fill hidden fields, humans never see them.
      if (clean(body.website, 200)) return send(req, res, 200, { ok: true, id: "ignored" });

      const name = clean(body.name, 80);
      const phone = clean(body.phone, 40);
      const message = clean(body.message, 2000);

      if (name.length < 2 || phone.length < 5 || message.length < 2) {
        return send(req, res, 400, { ok: false, error: "invalid_fields" });
      }

      const entry = {
        id: randomUUID(),
        name,
        phone,
        message,
        lang: body.lang === "en" ? "en" : "fa",
        ip,
        userAgent: clean(req.headers["user-agent"], 300),
        createdAt: new Date().toISOString(),
      };

      messages.push(entry);
      persistMessages();
      console.log(`[message] ${entry.name} (${entry.phone}) — ${entry.message.slice(0, 60)}...`);
      return send(req, res, 201, { ok: true, id: entry.id });
    }

    /* ---- admin: login with password ---- */
    if (pathname === "/api/admin/login" && method === "POST") {
      const ip = clientIp(req);
      const fails = loginFails.get(ip);
      if (fails && fails.count >= LOGIN_MAX_FAILS && Date.now() - fails.at < LOGIN_LOCK_MS) {
        const waitMin = Math.ceil((LOGIN_LOCK_MS - (Date.now() - fails.at)) / 60000);
        return send(req, res, 429, { ok: false, error: "locked", retryAfterMinutes: waitMin });
      }

      const body = await readJsonBody(req);
      if (!safeEqual(clean(body.password, 200), ADMIN_PASSWORD)) {
        loginFails.set(ip, { count: (fails?.count || 0) + 1, at: Date.now() });
        console.warn(`[auth] failed login attempt from ${ip}`);
        return send(req, res, 401, { ok: false, error: "wrong_password" });
      }

      loginFails.delete(ip);
      const token = randomBytes(32).toString("hex");
      sessions[token] = { createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL_MS, ip };
      persistSessions();
      return send(req, res, 200, { ok: true, token, expiresAt: sessions[token].expiresAt });
    }

    /* ---- admin: read all messages ---- */
    if (pathname === "/api/admin/messages" && method === "GET") {
      if (!authed(req)) return send(req, res, 401, { ok: false, error: "unauthorized" });
      const sorted = [...messages].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      return send(req, res, 200, { ok: true, total: sorted.length, messages: sorted });
    }

    /* ---- health check ---- */
    if (pathname === "/api/health" && method === "GET") {
      return send(req, res, 200, { ok: true, service: "cabinet21-messages", stored: messages.length });
    }

    if (pathname.startsWith("/api/")) {
      return send(req, res, 404, { ok: false, error: "not_found" });
    }

    /* ---- everything else: the website ---- */
    return serveStatic(req, res, pathname);
  } catch (err) {
    const statusCode = err?.statusCode || 500;
    if (statusCode === 500) console.error(err);
    return send(req, res, statusCode, { ok: false, error: statusCode === 500 ? "server_error" : err.message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("------------------------------------------------------------");
  console.log(`  Cabinet21 message server  →  http://localhost:${PORT}`);
  console.log(`  Admin API                 →  /api/admin/login`);
  console.log(`  Admin panel               →  http://localhost:${PORT}/#/admin`);
  console.log(`  Data folder               →  ${DATA_DIR}`);
  console.log(`  Password source           →  ${process.env.ADMIN_PASSWORD ? "ADMIN_PASSWORD (env)" : "built-in default"}`);
  console.log("------------------------------------------------------------");
});
