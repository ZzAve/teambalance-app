/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/vanillajs" />

interface ImportMetaEnv {
  // Base URL for the API in a split-origin build (e.g. https://api.teambalance.nl).
  // Unset in dev/e2e — the request stays relative and the Vite proxy handles it.
  readonly VITE_API_URL?: string
  // Name of the XSRF cookie when the API sets a renamed one (the demo build). Unset = XSRF-TOKEN.
  readonly VITE_XSRF_COOKIE?: string
  // Set (to true) only in the demo build, which is the only build that has the /demo guest login.
  readonly VITE_DEMO?: string
}
