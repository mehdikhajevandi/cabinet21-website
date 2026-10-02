/**
 * Web3Forms — sends the "free consultation" form straight to e-mail.
 * ------------------------------------------------------------------
 * The form needs no server, no hosting panel and no bank card: the
 * browser posts the form data to https://api.web3forms.com/submit and
 * Web3Forms delivers it to the inbox that owns the access key.
 *
 * The access key is a *public* identifier (it is shipped in the site
 * bundle, that is how Web3Forms works) and is tied to one inbox:
 *      mehdi.khajevandi.21@gmail.com
 *
 * To point the form at another inbox later:
 *   1. Create a free key at https://web3forms.com (just enter the e-mail).
 *   2. Put it in the project's ".env" file as
 *          VITE_WEB3FORMS_ACCESS_KEY=your-new-key
 *      …or replace the fallback value below.
 */

/** Public Web3Forms access key of the Cabinet21 inbox. */
export const WEB3FORMS_ACCESS_KEY =
  (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "").trim() ||
  "Da616331-2884-4c77-a1c2-2e455ca8af64";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Subject of the e-mail, per language of the visitor. */
export const WEB3FORMS_SUBJECT: Record<"fa" | "en", string> = {
  fa: "درخواست جدید مشاوره رایگان — کابینت ۲۱",
  en: "New free consultation request — Cabinet21",
};
