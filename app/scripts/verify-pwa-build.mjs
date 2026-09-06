#!/usr/bin/env node
// Proves the PWA output of `vite build` (F2, #159). Chained onto `npm run build`, so every
// build — local, CI, deploy — fails loudly if the installable shell silently stops being emitted
// (plugin dropped, workbox misconfigured, icons deleted from public/).
//
// The manifest's *shape* is asserted at the unit layer (src/app/pwa/manifest.test.ts); this
// checks the artefacts that only exist after a build.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const failures = []

const check = (description, condition) => {
  if (!condition) failures.push(description)
}

const read = (file) => (existsSync(resolve(dist, file)) ? readFileSync(resolve(dist, file), 'utf8') : null)

// 1. Service worker + its registration.
const sw = read('sw.js')
check('dist/sw.js is missing — the app has no service worker', sw !== null)
// Registration is bundled into the app itself (SwUpdateManager → virtual:pwa-register/react), not a
// plugin-injected registerSW.js (`injectRegister: null`), so the app owns update timing (Phase 3).
// Prove some hashed app chunk still registers the worker rather than checking for the dropped file.
const assetsDir = resolve(dist, 'assets')
const registersSW =
  existsSync(assetsDir) &&
  readdirSync(assetsDir).some((file) => {
    if (!file.endsWith('.js')) return false
    const code = readFileSync(resolve(assetsDir, file), 'utf8')
    return code.includes('serviceWorker') && code.includes('sw.js')
  })
check('no app chunk registers the service worker — registration is bundled via virtual:pwa-register/react', registersSW)

if (sw) {
  const precached = [...sw.matchAll(/url:"([^"]+)"/g)].map(([, url]) => url)
  check('the service worker precaches no app shell', precached.length > 0)
  check('index.html is not precached — offline navigation would fail', precached.includes('index.html'))
  check('no self-hosted font is precached — offline text would fall back to a system font', precached.some((url) => url.endsWith('.woff2')))
  check('no /api route is pinned to NetworkOnly — API responses must never be cached', sw.includes('NetworkOnly') && sw.includes('/api'))
  check('an /api URL is precached — session-authed, multi-tenant responses must never be cached', !precached.some((url) => url.startsWith('api/')))
  check('an install-dialog screenshot is precached — the shell never renders them, keep them out of every install', !precached.some((url) => url.startsWith('screenshots/')))
}

// 2. Web manifest, linked from the shell.
const manifest = read('manifest.webmanifest')
check('dist/manifest.webmanifest is missing — the app is not installable', manifest !== null)

const parsed = manifest ? JSON.parse(manifest) : {}
const icons = parsed.icons ?? []
const screenshots = parsed.screenshots ?? []
if (manifest) {
  check('the manifest is not named TeamBalance', parsed.name === 'TeamBalance')
  check('the manifest does not request standalone display', parsed.display === 'standalone')
  check('the manifest declares no maskable icon', icons.some((icon) => icon.purpose === 'maskable'))
}

// 3. Every image the shell points at is actually in the build.
for (const file of [...icons.map((icon) => icon.src), 'apple-touch-icon-180x180.png', 'favicon.ico', 'tb-monogram.svg']) {
  check(`dist/${file} is missing — regenerate with \`npm run generate-pwa-assets\``, existsSync(resolve(dist, file)))
}
for (const file of screenshots.map((shot) => shot.src)) {
  check(`dist/${file} is missing — recapture with \`npm run generate-pwa-screenshots\``, existsSync(resolve(dist, file)))
}

// 4. The shell wires it all together.
const html = read('index.html')
check('dist/index.html is missing', html !== null)
if (html) {
  check('index.html does not link the web manifest', /<link[^>]+rel="manifest"/.test(html))
  // The SW is no longer registered from index.html (no registerSW.js link); the app module below
  // registers it (verified against the app chunk above). index.html must still load that module.
  check('index.html does not load the app module bundle', /<script[^>]+type="module"[^>]+src="[^"]+"/.test(html))
  check('index.html has no theme-color', /<meta[^>]+name="theme-color"/.test(html))
  check('index.html has no apple-touch-icon', /<link[^>]+rel="apple-touch-icon"/.test(html))
  check('index.html still loads fonts from a third party — they are self-hosted (F13)', !html.includes('fonts.googleapis.com'))
}

if (failures.length > 0) {
  console.error('\n✗ PWA build verification failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`✓ PWA build verified: service worker, web manifest and ${icons.length} manifest icons emitted.`)
