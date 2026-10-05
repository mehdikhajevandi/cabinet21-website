import { randomUUID } from "node:crypto";
import { JsonBinError, readBin, writeBin } from "./jsonbin.js";
import {
  LIMITS,
  MESSAGE_STATUSES,
  validateCreateInput,
  validateId,
  validateStatusUpdate,
} from "./validate.js";

const API_PATH = "/api/messages";
const MAX_BODY_BYTES = 50 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_POST_MAX = 10;

/** Simple in-memory per-IP rate limiter for the public POST endpoint. */
const rateBuckets = new Map();

function clientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip, limit, windowMs) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);

  if (!bucket || now - bucket.startedAt > windowMs) {
    bucket = { startedAt: now, count: 0 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;

  if (rateBuckets.size > 500) {
    for (const [key, value] of rateBuckets) {
      if (now - value.startedAt > windowMs) rateBuckets.delete(key);
    }
  }

  return bucket.count > limit;
}

function sendJson(res, status, payload) {
  if (res.writableEnded || res.destroyed) return;
  try {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(payload));
  } catch {
    // Client went away — nothing to do.
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let rejected = false;

    req.on("data", (chunk) => {
      if (rejected) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        rejected = true;
        reject({ code: "body_too_large" });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (rejected) return;
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject({ code: "invalid_json" });
      }
    });

    req.on("error", (error) => reject(error));
  });
}

function matchesApiPath(req) {
  const pathname = (req.url || "").split("?")[0].replace(/\/+$/, "");
  return pathname === API_PATH;
}

function failFromError(error, res) {
  if (error instanceof JsonBinError) {
    return sendJson(res, error.status, { error: error.message, code: error.code });
  }

  if (error && typeof error === "object" && typeof error.code === "string") {
    if (error.code === "invalid_json" || error.code === "body_too_large") {
      return sendJson(res, 400, { error: "Invalid request body.", code: error.code });
    }
  }

  console.error("[api/messages] Unexpected error:", error);
  return sendJson(res, 500, { error: "Internal server error.", code: "internal_error" });
}

async function handleGet(res) {
  const { messages } = await readBin();
  sendJson(res, 200, { messages });
}

async function handlePost(req, res, ip) {
  if (isRateLimited(ip, RATE_LIMIT_POST_MAX, RATE_LIMIT_WINDOW_MS)) {
    return sendJson(res, 429, { error: "Too many requests.", code: "rate_limited" });
  }

  const body = await readJsonBody(req);
  const { ok, details, value } = validateCreateInput(body);
  if (!ok) {
    return sendJson(res, 400, {
      error: "Validation failed.",
      code: "validation_failed",
      details,
    });
  }

  const { record, messages } = await readBin();

  const message = {
    id: randomUUID(),
    name: value.name.slice(0, LIMITS.nameMax),
    email: value.email.slice(0, LIMITS.emailMax),
    phone: value.phone.slice(0, LIMITS.phoneMax),
    message: value.message.slice(0, LIMITS.messageMax),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await writeBin({ ...record, messages: [...messages, message] });
  sendJson(res, 201, { message });
}

async function handlePatch(req, res) {
  const body = await readJsonBody(req);
  const { ok, id, status, details } = validateStatusUpdate(body);
  if (!ok) {
    return sendJson(res, 400, {
      error: "Validation failed.",
      code: "validation_failed",
      details,
    });
  }

  const { record, messages } = await readBin();
  const index = messages.findIndex((item) => item && item.id === id);
  if (index === -1) {
    return sendJson(res, 404, { error: "Message not found.", code: "not_found" });
  }

  const updated = { ...messages[index], status };
  const nextMessages = [...messages];
  nextMessages[index] = updated;

  await writeBin({ ...record, messages: nextMessages });
  sendJson(res, 200, { message: updated });
}

async function handleDelete(req, res) {
  const body = await readJsonBody(req).catch(() => ({}));
  const rawId = new URL(req.url || API_PATH, "http://localhost").searchParams.get("id");
  const { ok, id } = validateId(body, rawId);
  if (!ok) {
    return sendJson(res, 400, {
      error: "Validation failed.",
      code: "validation_failed",
      details: { id: "invalid_id" },
    });
  }

  const { record, messages } = await readBin();
  const nextMessages = messages.filter((item) => !item || item.id !== id);
  if (nextMessages.length === messages.length) {
    return sendJson(res, 404, { error: "Message not found.", code: "not_found" });
  }

  await writeBin({ ...record, messages: nextMessages });
  sendJson(res, 200, { success: true, id });
}

/**
 * Creates a Node-style request handler for `/api/messages`.
 * When mounted with a `next` callback it delegates unmatched paths,
 * so the same handler works both in Vite middleware and in the
 * standalone production server.
 */
export function createMessagesHandler() {
  return async function messagesHandler(req, res, next) {
    if (!matchesApiPath(req)) {
      if (typeof next === "function") return next();
      return sendJson(res, 404, { error: "Not found.", code: "not_found" });
    }

    try {
      const method = (req.method || "GET").toUpperCase();

      if (method === "GET") return await handleGet(res);
      if (method === "POST") return await handlePost(req, res, clientIp(req));
      if (method === "PATCH") return await handlePatch(req, res);
      if (method === "DELETE") return await handleDelete(req, res);

      res.setHeader("Allow", "GET, POST, PATCH, DELETE");
      return sendJson(res, 405, { error: "Method not allowed.", code: "method_not_allowed" });
    } catch (error) {
      return failFromError(error, res);
    }
  };
}

export { API_PATH, MESSAGE_STATUSES };
