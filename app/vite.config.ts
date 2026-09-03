import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { pwaManifest, pwaWorkbox } from './src/app/pwa/manifest.ts'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // Installable app shell (F2). Workbox `generateSW` precaches the built shell and serves it
    // offline; see src/app/pwa/manifest.ts for the manifest and the never-cache-/api rule.
    // `registerType: 'prompt'` hands update *timing* to the app instead of the worker auto-skipping
    // waiting: SwUpdateManager registers the worker via `virtual:pwa-register/react` and decides when
    // to activate — auto by default, a toast only when a deploy lands mid-session (see
    // decideUpdateAction, caching plan Phase 3). `injectRegister: null` because we register ourselves,
    // so the plugin injects no registerSW.js. Left off in dev (the default) so the dev server and the
    // real e2e never run against a stale SW.
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      // The icon set and the master SVG are committed under public/ and generated ahead of the
      // build (`npm run generate-pwa-assets`), so the build itself needs no native image tooling;
      // Vite copies them to dist and the workbox globs pick them up (no `includeAssets` needed).
      manifest: pwaManifest,
      workbox: pwaWorkbox,
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, 'src/app'),
      '@pages': resolve(import.meta.dirname, 'src/pages'),
      '@widgets': resolve(import.meta.dirname, 'src/widgets'),
      '@features': resolve(import.meta.dirname, 'src/features'),
      '@entities': resolve(import.meta.dirname, 'src/entities'),
      '@shared': resolve(import.meta.dirname, 'src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
