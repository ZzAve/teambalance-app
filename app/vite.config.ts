import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { pwaManifest, pwaWorkbox } from './src/app/pwa/manifest'

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
    // `autoUpdate` + `injectRegister: 'auto'` keep registration out of the app bundle: the plugin
    // emits registerSW.js and links it from index.html, so a new deploy takes over on next load.
    // Left off in dev (the default) so the dev server and the real e2e never run against a stale SW.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // The icon set and the master SVG are committed under public/ and generated ahead of the
      // build (`npm run generate-pwa-assets`), so the build itself needs no native image tooling;
      // Vite copies them to dist and the workbox globs pick them up (no `includeAssets` needed).
      manifest: pwaManifest,
      workbox: pwaWorkbox,
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@shared': resolve(__dirname, 'src/shared'),
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
