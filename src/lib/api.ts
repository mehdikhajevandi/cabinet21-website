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

import { FORMSUBMIT_ENDPOINT, FORMSUBMIT_SUBJECT } from "./formsubmit";
import {
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
  WEB3FORMS_ENABLED,
  WEB3FORMS_SUBJECT,
} from "./web3forms";

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
/* Contact form → e-mail (FormSubmit + optional Web3Forms)             */
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
  /** true  → at least one e-mail channel accepted the request. */
  emailed: boolean;
  /** true  → a locally running Node server also stored it (admin panel). */
  stored: boolean;
  /** true  → a honeypot field was filled: silently ignored, nothing was sent. */
  ignored: boolean;
  /** E-mail channels that accepted the message (e.g. ["FormSubmit"]). */
  channels: string[];
};

/** Answer of one e-mail channel. */
type DeliveryOutcome = { channel: string; ok: boolean; detail: string };

/**
 * Access keys are UUIDs and a stray capital letter makes the lookup fail,
 * so the exact value is tried first and a lower-cased copy second.
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
 * POST a body to an endpoint with a 20 second deadline and hand back the
 * HTTP status plus the raw text (some providers answer with plain text).
 * Never throws — a dead network is reported as status 0.
 */
async function postRaw(
  url: string,
  body: BodyInit,
  contentType?: string,
): Promise<{ status: number; raw: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body,
      signal: controller.signal,
    });
    return { status: response.status, raw: await response.text() };
  } catch (error) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return { status: 0, raw: detail };
  } finally {
    clearTimeout(timer);
  }
}

const parseJson = (raw: string): Record<string, unknown> => {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
};

/**
 * Primary channel: FormSubmit delivers to the inbox written in the URL —
 * no key, no account. The very first submission triggers a one-time
 * confirmation e-mail for the mailbox owner.
 */
async function deliverWithFormSubmit(payload: ConsultationPayload): Promise<DeliveryOutcome> {
  const language = payload.lang === "en" ? "English" : "فارسی";
  const body = JSON.stringify({
    name: payload.name,
    phone: payload.phone,
    message: payload.message,
    language,
    _subject: FORMSUBMIT_SUBJECT[payload.lang === "en" ? "en" : "fa"],
    _template: "table",
    _captcha: "false",
  });

  const { status, raw } = await postRaw(FORMSUBMIT_ENDPOINT, body, "application/json");
  const data = parseJson(raw);
  const message = String(data.message || raw.slice(0, 300));
  const success = data.success === true || String(data.success) === "true";

  if (success) return { channel: "FormSubmit", ok: true, detail: "accepted" };

  // Until the mailbox owner clicks the confirmation link, FormSubmit keeps
  // answering with a "confirm your e-mail" notice — not a real failure.
  if (status === 200 && /confirm/i.test(message)) {
    console.warn(
      "[Cabinet21 form] FormSubmit sent a one-time confirmation e-mail — open it and click the link; " +
        "from then on every message is delivered. Detail: " +
        message,
    );
    return { channel: "FormSubmit", ok: true, detail: "awaiting_confirmation" };
  }

  const detail = `HTTP ${status} — ${message || "empty response"}`;
  console.error(`[Cabinet21 form] FormSubmit rejected the request: ${detail}`);
  return { channel: "FormSubmit", ok: false, detail };
}

/** Optional channel: only runs when the studio configured its own key. */
async function deliverWithWeb3Forms(payload: ConsultationPayload): Promise<DeliveryOutcome> {
  const language = payload.lang === "en" ? "English" : "فارسی";
  let detail = "no access key configured";

  for (const key of accessKeyCandidates()) {
    const formData = new FormData();
    formData.append("access_key", key);
    formData.append("subject", WEB3FORMS_SUBJECT[payload.lang === "en" ? "en" : "fa"]);
    formData.append("from_name", "وب‌سایت کابینت ۲۱ — فرم مشاوره");
    formData.append("name", payload.name);
    formData.append("phone", payload.phone);
    formData.append("message", payload.message);
    formData.append("language", language);

    const { status, raw } = await postRaw(WEB3FORMS_ENDPOINT, formData);
    const data = parseJson(raw);

    if (status === 200 && data.success === true) {
      return { channel: "Web3Forms", ok: true, detail: "accepted" };
    }

    detail = `HTTP ${status} — ${String(data.message || raw.slice(0, 300) || "empty response")}`;
    console.error(
      `[Cabinet21 form] Web3Forms rejected the request (key ending "…${key.slice(-6)}"): ${detail}`,
    );
  }

  return { channel: "Web3Forms", ok: false, detail };
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
 * 1. The message is e-mailed. Two channels run in parallel and one success is
 *    enough: FormSubmit (delivers to the studio inbox written in the URL, no
 *    key, no account) and — when a key is configured — Web3Forms.
 * 2. If (and only if) the Node server answers — running locally, or because the
 *    site is self-hosted with `node server/index.js` — the message is also kept
 *    for the admin panel (`site/#/admin`). Best effort: a static deployment has
 *    no server and only needs the e-mail.
 *
 * Throws `ConsultationError` only when *every* path failed, and the reason is
 * logged to the browser console under the "[Cabinet21 form]" prefix.
 */
export async function sendConsultationRequest(payload: ConsultationPayload): Promise<ConsultationResult> {
  // Honeypot: pretend everything went fine, so the bot does not retry.
  if ((payload.website || "").trim() || (payload.botcheck || "").trim()) {
    return { emailed: false, stored: false, ignored: true, channels: [] };
  }

  const attempts: Promise<DeliveryOutcome>[] = [deliverWithFormSubmit(payload)];
  if (WEB3FORMS_ENABLED) attempts.push(deliverWithWeb3Forms(payload));

  const outcomes = await Promise.all(attempts);
  const channels = outcomes.filter((o) => o.ok).map((o) => o.channel);
  const emailed = channels.length > 0;

  if (!emailed) {
    console.error(
      "[Cabinet21 form] The message was NOT e-mailed. Check: (1) internet/CORS to formsubmit.co, " +
        "(2) the FormSubmit confirmation link was clicked, (3) for Web3Forms: the key belongs to a " +
        "confirmed account and is not on the bounce/suppression list (support@web3forms.com).",
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

  if (!emailed && !stored) {
    const reason = outcomes.map((o) => `${o.channel}: ${o.detail}`).join(" | ");
    throw new ConsultationError("send_failed", reason);
  }

  return { emailed, stored, ignored: false, channels };
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
