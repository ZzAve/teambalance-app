/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  // Base URL for the API in a split-origin build (e.g. https://api.teambalance.nl).
  // Unset in dev/e2e — the request stays relative and the Vite proxy handles it.
  readonly VITE_API_URL?: string
}
