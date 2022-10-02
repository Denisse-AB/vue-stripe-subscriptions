/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASIC_PLAN: string
  readonly VITE_PREMIUM_PLAN: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
