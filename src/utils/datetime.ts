/** Formats an ISO date as a localized date + time (Jalali for `fa`). */
export function formatDateTime(iso: string, lang: "fa" | "en"): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  try {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/** Formats a number with localized digits (`۳` for fa, `3` for en). */
export function formatCount(value: number, lang: "fa" | "en"): string {
  try {
    return value.toLocaleString(lang === "fa" ? "fa-IR" : "en-US");
  } catch {
    return String(value);
  }
}
