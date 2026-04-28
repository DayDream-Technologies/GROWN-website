/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BFF_ORIGIN?: string;
  readonly VITE_SQUARE_APPLICATION_ID?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
