/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
