/**
 * Tiny client for the Cabinet21 message server (see /server/index.js).
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
