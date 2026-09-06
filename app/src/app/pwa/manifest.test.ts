import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pwaManifest, pwaWorkbox } from './manifest'

// The service worker and web manifest are build-time artefacts with no runtime seam to story
// or e2e, so the config object is the lowest layer that proves them. `scripts/verify-pwa-build.mjs`
// (chained onto `npm run build`) proves the build actually emits what this config describes.

const appRoot = resolve(__dirname, '../../..')

const matchesApi = (url: string) => {
  const rule = pwaWorkbox!.runtimeCaching!.find((r) => r.handler === 'NetworkOnly')!
  const matcher = rule.urlPattern as (options: { url: URL }) => boolean
  return Boolean(matcher({ url: new URL(url) }))
}

describe('pwaManifest', () => {
  it('describes an installable, standalone TeamBalance app', () => {
    expect(pwaManifest).toMatchObject({
      name: 'TeamBalance',
      short_name: 'TeamBalance',
      display: 'standalone',
      orientation: 'any',
      start_url: '/',
      scope: '/',
    })
  })

  it('paints the shell with the background design token', () => {
    const tokens = readFileSync(resolve(appRoot, '../design-tokens/tokens.css'), 'utf8')
    const background = tokens.match(/--color-background:\s*(#[0-9A-Fa-f]{6})/)?.[1]

    expect(background).toBeDefined()
    expect(pwaManifest.background_color).toBe(background)
    // Static light value until F11 makes theme-color theme-aware.
    expect(pwaManifest.theme_color).toBe(background)
  })

  it('ships the canonical icon sizes, each also as a maskable variant', () => {
    const icons = pwaManifest.icons ?? []
    const sizesOf = (purpose?: string) =>
      icons.filter((icon) => icon.purpose === purpose).map((icon) => icon.sizes)

    expect(sizesOf(undefined)).toEqual(
      expect.arrayContaining(['64x64', '192x192', '384x384', '512x512', '1024x1024']),
    )
    expect(sizesOf('maskable')).toEqual(
      expect.arrayContaining(['192x192', '384x384', '512x512', '1024x1024']),
    )
  })

  it('previews the events overview for both form factors', () => {
    const formFactors = (pwaManifest.screenshots ?? []).map((shot) => shot.form_factor)

    expect(formFactors).toEqual(expect.arrayContaining(['narrow', 'wide']))
  })

  it('offers an Events shortcut through the slug-less dispatcher route', () => {
    expect(pwaManifest.shortcuts).toEqual([expect.objectContaining({ name: 'Events', url: '/events' })])
  })

  it('only references images that are committed under public/', () => {
    const sources = [
      ...(pwaManifest.icons ?? []),
      ...(pwaManifest.screenshots ?? []),
      ...(pwaManifest.shortcuts ?? []).flatMap((shortcut) => shortcut.icons ?? []),
    ].map((image) => image.src)
    const missing = sources.filter((src) => !existsSync(resolve(appRoot, 'public', src)))

    expect(missing).toEqual([])
  })
})

describe('pwaWorkbox', () => {
  it('precaches the built shell — markup, code, styles, fonts and icons', () => {
    const globs = pwaWorkbox!.globPatterns!.join(' ')

    for (const extension of ['html', 'js', 'css', 'woff2', 'png', 'svg', 'ico']) {
      expect(globs).toContain(extension)
    }
  })

  it('keeps the install-dialog screenshots out of the precache', () => {
    expect(pwaWorkbox!.globIgnores).toContain('screenshots/**')
  })

  it('serves the precached shell for offline SPA navigations', () => {
    expect(pwaWorkbox!.navigateFallback).toBe('/index.html')
  })

  it('never answers an /api request with the HTML shell', () => {
    const denylist = pwaWorkbox!.navigateFallbackDenylist ?? []

    expect(denylist.some((pattern) => pattern.test('/api/events'))).toBe(true)
    expect(denylist.some((pattern) => pattern.test('/events'))).toBe(false)
  })

  // Sessions are cookie-authenticated and the backend is multi-tenant: a cached API response
  // could outlive the session or surface another tenant's data. Nothing under /api is cached,
  // on either the same-origin dev proxy or the split-origin production API.
  it('keeps every /api request on the network, same-origin and cross-origin alike', () => {
    expect(matchesApi('http://localhost:5173/api/events')).toBe(true)
    expect(matchesApi('https://api.teambalance.nl/api/attendances')).toBe(true)
    expect(matchesApi('https://api.teambalance.nl/api/ping')).toBe(true)
  })

  it('leaves the precached shell assets to the precache router', () => {
    expect(matchesApi('https://app.teambalance.nl/assets/index-abc123.js')).toBe(false)
    expect(matchesApi('https://app.teambalance.nl/index.html')).toBe(false)
  })
})
