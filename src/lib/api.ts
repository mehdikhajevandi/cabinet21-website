/**
 * Tiny client for the Cabinet21 message server (see /server/index.js)
 * plus the Web3Forms e-mail relay used by the public consultation form.
 *
 * By default requests go to the same origin (`/api/...`), which works when the
 * Node server also serves the built site. If the site lives on a static host
 * (GitHub Pages / Netlify / Vercel) and the server runs somewhere else, set the
 * API address at build time:
 *
 *    VITE_API_BASE="https://cabinet21-api.onrender.com" npm run build
 *
 * ...or at runtime by adding this before the app script in index.html:
 *
 *    <script>window.__CABINET21_API__ = "https://cabinet21-api.onrender.com";</script>
 */

import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT, WEB3FORMS_SUBJECT } from "./web3forms";

export type Message = {
  id: string;
  name: string;
  phone: string;
  message: string;
  lang: "fa" | "en";
  createdAt: string;
};

const trimSlash = (value: string) => value.replace(/\/+$/, "");

const runtimeBase =
  typeof window !== "undefined"
    ? trimSlash(String((window as unknown as { __CABINET21_API__?: string }).__CABINET21_API__ || ""))
    : "";

const envBase = trimSlash(String(import.meta.env.VITE_API_BASE || ""));

/** Base URL of the message API ("" = same origin). */
export const API_BASE = runtimeBase || envBase;

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message?: string) {
    super(message || code);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers || {}),
      },
    });
  } catch {
    // Network failure / CORS / server down
    throw new ApiError(0, "unreachable");
  }

  let data: T & { error?: string };
  try {
    data = (await res.json()) as T & { error?: string };
  } catch {
    throw new ApiError(res.status, "bad_response");
  }

  if (!res.ok) throw new ApiError(res.status, data?.error || "error");
  return data;
}

/** Send a consultation request from the public form. */
export function submitMessage(payload: {
  name: string;
  phone: string;
  message: string;
  lang: "fa" | "en";
  website?: string;
}) {
  return request<{ ok: boolean; id: string }>("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ------------------------------------------------------------------ */
/* Contact form → e-mail (Web3Forms)                                   */
/* ------------------------------------------------------------------ */

export type ConsultationPayload = {
  name: string;
  phone: string;
  message: string;
  lang: "fa" | "en";
  /** Classic honeypot: invisible for visitors, spam bots fill it in. */
  website?: string;
  /** Web3Forms honeypot (hidden checkbox). */
  botcheck?: string;
};

export type ConsultationResult = {
  /** true  → Web3Forms accepted the request, the e-mail is on its way. */
  emailed: boolean;
  /** true  → a locally running Node server also stored it (admin panel). */
  stored: boolean;
  /** true  → a honeypot field was filled: silently ignored, nothing was sent. */
  ignored: boolean;
};

/** Raised when the message could neither be e-mailed nor stored. */
export class ConsultationError extends Error {
  code: string;

  constructor(code = "send_failed", message?: string) {
    super(message || code);
    this.name = "ConsultationError";
    this.code = code;
  }
}

/**
 * Does a Cabinet21 Node server answer behind `/api` right now?
 * Probed once per page load, so a purely static site never pays the price of
 * a pointless request (and never mistakes index.html for an API reply).
 */
let serverProbe: Promise<boolean> | null = null;

function messageServerAvailable(): Promise<boolean> {
  if (!serverProbe) {
    serverProbe = (async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${API_BASE}/api/health`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        clearTimeout(timer);
        return res.ok && (res.headers.get("content-type") || "").includes("application/json");
      } catch {
        return false;
      }
    })();
  }
  return serverProbe;
}

/**
 * Send a consultation request.
 *
 * 1. The message is e-mailed through Web3Forms → the studio inbox.
 * 2. If (and only if) the Node server answers — running locally, or because the
 *    site is self-hosted with `node server/index.js` — the message is also kept
 *    for the admin panel (`site/#/admin`). That step is best effort: a static
 *    deployment has no server and only needs the e-mail.
 *
 * Throws `ConsultationError` only when *both* paths failed.
 */
export async function sendConsultationRequest(payload: ConsultationPayload): Promise<ConsultationResult> {
  // Honeypot: pretend everything went fine, so the bot does not retry.
  if ((payload.website || "").trim() || (payload.botcheck || "").trim()) {
    return { emailed: false, stored: false, ignored: true };
  }

  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("subject", WEB3FORMS_SUBJECT[payload.lang === "en" ? "en" : "fa"]);
  formData.append("from_name", "وب‌سایت کابینت ۲۱ — فرم مشاوره");
  formData.append("name", payload.name);
  formData.append("phone", payload.phone);
  formData.append("message", payload.message);
  formData.append("language", payload.lang === "en" ? "English" : "فارسی");

  let emailed = false;
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    emailed = response.ok && data?.success === true;
    if (!emailed) console.warn("[contact] Web3Forms rejected the request:", data?.message || response.status);
  } catch (error) {
    console.warn("[contact] Web3Forms is unreachable:", error);
  }

  let stored = false;
  if (await messageServerAvailable()) {
    try {
      await submitMessage(payload);
      stored = true;
    } catch {
      /* the e-mail is what matters — the admin mirror stays optional */
    }
  }

  if (!emailed && !stored) throw new ConsultationError("send_failed");
  return { emailed, stored, ignored: false };
}

/** Exchange the admin password for a session token. */
export async function adminLogin(password: string): Promise<string> {
  const data = await request<{ ok: boolean; token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return data.token;
}

/** Fetch every stored message (newest first). Requires a valid token. */
export function fetchMessages(token: string) {
  return request<{ ok: boolean; total: number; messages: Message[] }>("/api/admin/messages", {}, token);
}

const TOKEN_KEY = "cabinet21-admin-token";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? "" : window.localStorage.getItem(TOKEN_KEY) || ""),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};
