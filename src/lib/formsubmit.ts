/**
 * FormSubmit — the studio's own e-mail channel (default).
 * ------------------------------------------------------------------
 * No account, no key, no credit card: the destination inbox is written
 * in the URL, so the message can only ever land in that mailbox.
 *
 *   POST https://formsubmit.co/ajax/<target>
 *
 * The first submission to a target triggers a one-time confirmation
 * e-mail from FormSubmit; after that link is clicked, every submission
 * is delivered (unlimited, free).
 *
 * Privacy: after confirming, FormSubmit shows a random alias
 * (e.g. "el/1a2b3c4d") that can replace the plain address in the URL so
 * scrapers never see it. Put that alias in `.env`:
 *
 *    VITE_FORM_SUBMIT_TARGET=el/1a2b3c4d
 */

const BUILT_IN_TARGET = "mehdi.khajevandi.21@gmail.com";

/** Inbox (or FormSubmit alias) that receives the consultation requests. */
export const FORMSUBMIT_TARGET = (import.meta.env.VITE_FORM_SUBMIT_TARGET || "").trim() || BUILT_IN_TARGET;

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_TARGET}`;

export const FORMSUBMIT_SUBJECT: Record<"fa" | "en", string> = {
  fa: "درخواست جدید مشاوره رایگان — کابینت ۲۱",
  en: "New free consultation request — Cabinet21",
};
