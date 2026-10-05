import { ApiError } from "./client";
import type { Translations } from "../i18n/translations";

type ErrorKey = keyof Translations["errors"];

const CODE_TO_KEY: Record<string, ErrorKey> = {
  network_error: "network_error",
  timeout: "network_error",
  internal_error: "server_error",
  jsonbin_error: "server_error",
  rate_limited: "rate_limited",
  invalid_access_key: "access_denied",
  bin_not_found: "access_denied",
  missing_access_key: "missing_config",
  missing_bin_id: "missing_config",
  not_found: "not_found",
  validation_failed: "validation_failed",
};

/**
 * Maps an API error to a localized, user-friendly message.
 * `fallback` is used when nothing more specific applies.
 */
export function apiErrorMessage(error: unknown, t: Translations, fallback?: string): string {
  if (error instanceof ApiError) {
    if (error.code && CODE_TO_KEY[error.code]) {
      return t.errors[CODE_TO_KEY[error.code]];
    }
    if (error.status === 0) return t.errors.network_error;
    if (error.status === 429) return t.errors.rate_limited;
    if (error.status === 404) return t.errors.not_found;
    if (error.status === 400) return t.errors.validation_failed;
    if (error.status >= 500 || error.status === 503) return t.errors.server_error;
  }
  return fallback ?? t.errors.generic;
}
