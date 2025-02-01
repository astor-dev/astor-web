/// <reference types="astro/client" />
/// <reference types="astro/content" />

interface ImportMetaEnv {
  readonly PUBLIC_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
