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
  // The app is phone-first but usable on desktop and tablet, so no lock: `any` states the intent
  // (rotate freely) without changing behaviour.
  orientation: 'any',
  background_color: BACKGROUND,
  // Deliberately still the light value after F11 (dark mode), and not an oversight: the manifest is
  // read once at install time, so `theme_color`/`background_color` cannot follow a runtime theme the
  // way the <meta name="theme-color"> in index.html now does. The installed app therefore shows a
  // light splash/launch background even for a dark-mode user — a single frame before the shell
  // paints, at which point the meta tag takes over and the chrome goes dark. Chosen over a neutral
  // mid-grey that would look wrong in both themes rather than briefly wrong in one.
  theme_color: BACKGROUND,
  icons: [
    { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'pwa-384x384.png', sizes: '384x384', type: 'image/png' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: 'pwa-1024x1024.png', sizes: '1024x1024', type: 'image/png' },
    { src: 'maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: 'maskable-icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'maskable' },
    { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: 'maskable-icon-1024x1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
  ],
  // Rich install preview (one per form factor). Captured from the running app by
  // `npm run generate-pwa-screenshots` (scripts/capture-pwa-screenshots.mjs) and committed under
  // public/screenshots/; `sizes` must match the PNG pixel dimensions, so the script prints them.
  screenshots: [
    {
      src: 'screenshots/events-narrow.png',
      sizes: '780x1688',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Upcoming events with who is coming',
    },
    {
      src: 'screenshots/events-wide.png',
      sizes: '2560x1600',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Upcoming events with who is coming',
    },
  ],
  // Long-press / right-click quick actions on the installed icon. Every team screen lives under
  // /t/:slug, which a static shortcut cannot know, so /events is a slug-less entry point that lands
  // on the Active Team's events (src/routes/events.tsx). Money is the next candidate once it ships.
  shortcuts: [
    {
      name: 'Events',
      url: '/events',
      icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
    },
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
  // The install-dialog screenshots are the one PNG set the shell never renders, and by far the
  // largest — keep them out of every install's precache.
  globIgnores: ['screenshots/**'],
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
  // Evict the precache of superseded builds once the new worker activates — keep it on.
  cleanupOutdatedCaches: true,
  // `clientsClaim` deliberately omitted (caching plan Phase 3): control transfers on our own
  // controlled reload (SwUpdateManager → updateServiceWorker → SKIP_WAITING → controllerchange →
  // reload), so the worker never needs to seize already-open clients the moment it activates.
}
