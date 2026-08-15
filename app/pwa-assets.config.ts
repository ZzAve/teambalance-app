import { defineConfig } from '@vite-pwa/assets-generator/config'

// PWA icon set (F2). Generated once, ahead of the build, and committed under public/ —
// not generated during `vite build`, so neither CI nor a contributor's build depends on
// sharp's native binaries. Regenerate with `npm run generate-pwa-assets` after editing
// the master, and commit the result.
//
// Source of truth: public/tb-monogram.svg — one maskable master, everything else derives
// from it. padding: 0 because the master already reserves the maskable safe zone; letting
// the preset add its default 30% on top would shrink the monogram twice. The background
// matches --color-background so the letterboxed edges (none for a square master, but the
// apple icon is composited on an opaque canvas) stay on-brand instead of white.
const BACKGROUND = '#F8F6F0'
const resizeOptions = { fit: 'contain', background: BACKGROUND } as const

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: { sizes: [64, 192, 512], favicons: [[48, 'favicon.ico']], padding: 0, resizeOptions },
    maskable: { sizes: [512], padding: 0, resizeOptions },
    apple: { sizes: [180], padding: 0, resizeOptions },
  },
  images: ['public/tb-monogram.svg'],
})
