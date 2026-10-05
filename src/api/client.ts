const REQUEST_TIMEOUT_MS = 20000;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Thin JSON fetch wrapper. Only talks to same-origin relative URLs —
 * credentials/keys stay on the server.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError("Network error", 0, "network_error");
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const payload = data as { error?: string; code?: string; details?: Record<string, string> } | null;
    throw new ApiError(
      payload?.error || `Request failed (${response.status})`,
      response.status,
      payload?.code,
      payload?.details
    );
  }

  return data as T;
}
