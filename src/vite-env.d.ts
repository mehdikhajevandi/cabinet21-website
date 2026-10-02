/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the message API (empty = same origin). */
  readonly VITE_API_BASE?: string;
  /** Web3Forms access key that receives the contact form by e-mail. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Optional runtime override for the API address, set before the app script. */
  __CABINET21_API__?: string;
}
