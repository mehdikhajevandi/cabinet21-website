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

/**
 * Access keys are UUIDs and a stray capital letter makes the lookup fail,
 * so the exact value is tried first and a lower-cased copy second.
 * (`VITE_WEB3FORMS_ACCESS_KEY` in `.env` always wins over the built-in key.)
 */
function accessKeyCandidates(): string[] {
  const keys = [WEB3FORMS_ACCESS_KEY];
  const lower = WEB3FORMS_ACCESS_KEY.toLowerCase();
  if (!keys.includes(lower)) keys.push(lower);
  return keys;
}

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

  let emailed = false;
  let lastError = "";

  for (const key of accessKeyCandidates()) {
    const formData = new FormData();
    formData.append("access_key", key);
    formData.append("subject", WEB3FORMS_SUBJECT[payload.lang === "en" ? "en" : "fa"]);
    formData.append("from_name", "وب‌سایت کابینت ۲۱ — فرم مشاوره");
    formData.append("name", payload.name);
    formData.append("phone", payload.phone);
    formData.append("message", payload.message);
    formData.append("language", payload.lang === "en" ? "English" : "فارسی");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      // Read the body as text first: Web3Forms always explains a rejection,
      // but the reply is not JSON when something goes wrong upstream.
      const raw = await response.text();
      let data: { success?: boolean; message?: string } = {};
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        /* not JSON — keep the raw text for the log below */
      }

      if (response.ok && data.success === true) {
        emailed = true;
        break;
      }

      lastError = `HTTP ${response.status} — ${data.message || raw.slice(0, 300) || "no response body"}`;
      console.error(
        `[Cabinet21 form] Web3Forms rejected the request (key ending "…${key.slice(-6)}"): ${lastError}`,
      );
    } catch (error) {
      lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      console.error(`[Cabinet21 form] Web3Forms is unreachable: ${lastError}`);
    }
  }

  if (!emailed) {
    console.error(
      "[Cabinet21 form] The message was NOT e-mailed. Check: (1) the access key belongs to a confirmed " +
        "Web3Forms account, (2) the address is not on Web3Forms' bounce/suppression list " +
        "(support@web3forms.com), (3) the monthly quota of the free plan (250) is not used up.",
    );
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

  if (!emailed && !stored) throw new ConsultationError("send_failed", lastError);
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
