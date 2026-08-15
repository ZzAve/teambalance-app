import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa'

/**
 * PWA app-shell configuration (F2, #159) — consumed by `vite.config.ts`.
 *
 * It lives in `src/app/` (the layer that owns app-wide providers, routing and global styles)
 * rather than inline in `vite.config.ts` so the shape can be asserted by a plain Vitest unit:
 * the service worker and manifest are build-time artefacts with no runtime seam to story or
 * e2e, so the config object is the lowest layer that proves them.
 */

/** `--color-background` from design-tokens/tokens.css. Icon files carry the same literal. */
const BACKGROUND = '#F8F6F0'

export const pwaManifest: Partial<ManifestOptions> = {
  id: '/',
  name: 'TeamBalance',
  short_name: 'TeamBalance',
  description: 'Event attendance and shared money pool for sports teams.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: BACKGROUND,
  // Static light value for now. F11 (dark mode) makes `theme-color` follow the active theme —
  // both here and in the <meta name="theme-color"> in index.html.
  theme_color: BACKGROUND,
  icons: [
    { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}

/**
 * Workbox (`generateSW`) options.
 *
 * The service worker precaches the built shell **only** — hashed JS/CSS, index.html, the
 * self-hosted woff2 files and the icon set — and serves it for offline navigations.
 *
 * Nothing under `/api` is ever cached: sessions are cookie-authenticated and the backend is
 * multi-tenant, so a cached response could be served to the wrong tenant or long after the
 * session ended. The predicate matches on pathname, which covers both the same-origin dev/preview
 * proxy and the split-origin production API (app.teambalance.nl → api.teambalance.nl).
 */
export const pwaWorkbox: VitePWAOptions['workbox'] = {
  globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
  // Offline SPA navigations render the precached shell…
  navigateFallback: '/index.html',
  // …but a request for data must never be answered with HTML.
  navigateFallbackDenylist: [/^\/api\//],
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api'),
      handler: 'NetworkOnly',
    },
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
}
