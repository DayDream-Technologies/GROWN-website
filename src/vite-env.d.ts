/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deploy base path (e.g. `/` on Amplify, `/GROWN-website/` on GitHub Pages). Set via `VITE_BASE` at build time. */
  readonly VITE_BASE?: string;
  readonly VITE_BFF_ORIGIN?: string;
  readonly VITE_SQUARE_APPLICATION_ID?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
