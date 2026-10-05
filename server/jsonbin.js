import { loadEnv } from "./env.js";

const DEFAULT_API_BASE = "https://api.jsonbin.io/v3";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Error carrying the HTTP status our API should answer with,
 * plus a machine readable `code` for the frontend.
 */
export class JsonBinError extends Error {
  constructor(message, { status = 502, code = "jsonbin_error" } = {}) {
    super(message);
    this.name = "JsonBinError";
    this.status = status;
    this.code = code;
  }
}

function getConfig() {
  loadEnv();

  const accessKey = process.env.JSONBIN_ACCESS_KEY;
  const binId = process.env.JSONBIN_BIN_ID;
  const apiBase = process.env.JSONBIN_API_BASE || DEFAULT_API_BASE;

  if (!accessKey) {
    throw new JsonBinError("JSONBIN_ACCESS_KEY is not configured on the server.", {
      status: 503,
      code: "missing_access_key",
    });
  }
  if (!binId) {
    throw new JsonBinError("JSONBIN_BIN_ID is not configured on the server.", {
      status: 503,
      code: "missing_bin_id",
    });
  }

  return { accessKey, binId, apiBase };
}

function headers(accessKey, extra = {}) {
  return {
    "Content-Type": "application/json",
    "X-Access-Key": accessKey,
    ...extra,
  };
}

function mapUpstreamError(status) {
  if (status === 401 || status === 403) {
    return { status: 502, code: "invalid_access_key" };
  }
  if (status === 404) {
    return { status: 502, code: "bin_not_found" };
  }
  if (status === 429) {
    return { status: 429, code: "rate_limited" };
  }
  return { status: 502, code: "jsonbin_error" };
}

async function request(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    const timedOut = error?.name === "AbortError" || error?.name === "TimeoutError";
    throw new JsonBinError(timedOut ? "JSONBin request timed out." : "Could not reach JSONBin.", {
      status: 502,
      code: "network_error",
    });
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const mapped = mapUpstreamError(response.status);
    throw new JsonBinError(data?.message || `JSONBin responded with ${response.status}.`, mapped);
  }

  return data;
}

/** Be liberal in what we accept from the bin and always expose `messages[]`. */
export function extractMessages(record) {
  if (Array.isArray(record)) return record;
  if (record && Array.isArray(record.messages)) return record.messages;
  return [];
}

/** GET /v3/b/{binId}/latest — always returns the newest snapshot. */
export async function readBin() {
  const { accessKey, binId, apiBase } = getConfig();

  const data = await request(`${apiBase}/b/${encodeURIComponent(binId)}/latest`, {
    method: "GET",
    headers: headers(accessKey),
  });

  const record = data && typeof data.record === "object" && data.record !== null ? data.record : {};
  return { record, messages: extractMessages(record) };
}

/** PUT /v3/b/{binId} — replaces the whole bin with the given record. */
export async function writeBin(record) {
  const { accessKey, binId, apiBase } = getConfig();

  const data = await request(`${apiBase}/b/${encodeURIComponent(binId)}`, {
    method: "PUT",
    headers: headers(accessKey),
    body: JSON.stringify(record),
  });

  return data && data.record !== undefined ? data.record : record;
}
