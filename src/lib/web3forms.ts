/**
 * Web3Forms — optional second e-mail channel.
 * ------------------------------------------------------------------
 * ⚠️ IMPORTANT: an access key is an *alias of one inbox* — whoever
 * created the key receives every message sent with it
 * (see https://docs.web3forms.com/getting-started/faq).
 *
 * The key `Da616331-2884-4c77-a1c2-2e455ca8af64` was not created with
 * the studio address, so messages sent with it never reach
 * mehdi.khajevandi.21@gmail.com — and customer names/phone numbers
 * would end up in a stranger's mailbox. It is therefore NOT used.
 *
 * To enable this channel with your OWN key:
 *   1. https://web3forms.com → enter mehdi.khajevandi.21@gmail.com →
 *      "Create Access Key" (free, no account needed) and confirm the
 *      e-mail they send you.
 *   2. Either paste it in the `.env` file
 *          VITE_WEB3FORMS_ACCESS_KEY=your-key
 *      or set FALLBACK_ACCESS_KEY below.
 *
 * Meanwhile the studio inbox is served by FormSubmit (see formsubmit.ts).
 */

/** Optional: paste your own Web3Forms key here to enable this channel. */
const FALLBACK_ACCESS_KEY = "";

/** Access key of the studio inbox — empty means "channel disabled". */
export const WEB3FORMS_ACCESS_KEY = (
  (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "").trim() || FALLBACK_ACCESS_KEY
).trim();

export const WEB3FORMS_ENABLED = WEB3FORMS_ACCESS_KEY.length > 0;

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const WEB3FORMS_SUBJECT: Record<"fa" | "en", string> = {
  fa: "درخواست جدید مشاوره رایگان — کابینت ۲۱",
  en: "New free consultation request — Cabinet21",
};
