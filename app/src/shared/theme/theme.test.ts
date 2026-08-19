import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  applyTheme,
  DARK_COLOR_SCHEME_QUERY,
  readThemePreference,
  resolveTheme,
  THEME_COLOR,
  THEME_STORAGE_KEY,
  writeThemePreference,
} from './theme'

// Pure theme logic: preference persistence + the preference × OS-preference → resolved-theme table,
// plus applyTheme, which is a DOM write (root class + meta tag) with no rendering. This is the
// "pure non-rendering logic" case the strategy assigns to Vitest; the toggle UI is covered by its
// story, and the store's system-follow wiring by theme-store.test.ts.

/** Minimal in-memory Storage stand-in, so read/write assertions never depend on test ordering. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    read: (key: string) => data.get(key) ?? null,
  }
}

describe('resolveTheme', () => {
  it.each([
    ['light', true],
    ['light', false],
    ['dark', true],
    ['dark', false],
  ] as const)('honours an explicit "%s" preference whatever the OS says (prefersDark=%s)', (pref, prefersDark) => {
    expect(resolveTheme(pref, prefersDark)).toBe(pref)
  })

  it('follows the OS when the preference is system', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
})

describe('readThemePreference', () => {
  it('defaults to system when nothing is stored', () => {
    expect(readThemePreference(fakeStorage())).toBe('system')
  })

  it.each(['system', 'light', 'dark'] as const)('reads back a stored "%s" preference', (pref) => {
    expect(readThemePreference(fakeStorage({ [THEME_STORAGE_KEY]: pref }))).toBe(pref)
  })

  it('falls back to system on a stored value that is not a preference', () => {
    expect(readThemePreference(fakeStorage({ [THEME_STORAGE_KEY]: 'solar-flare' }))).toBe('system')
  })

  it('falls back to system when storage is missing or throws', () => {
    expect(readThemePreference(null)).toBe('system')
    expect(
      readThemePreference({
        getItem: () => {
          throw new Error('storage disabled')
        },
        setItem: () => {},
      }),
    ).toBe('system')
  })
})

describe('writeThemePreference', () => {
  it.each(['system', 'light', 'dark'] as const)('persists the "%s" preference under the shared key', (pref) => {
    const storage = fakeStorage()
    writeThemePreference(pref, storage)
    expect(storage.read(THEME_STORAGE_KEY)).toBe(pref)
  })

  it('round-trips through the same storage', () => {
    const storage = fakeStorage()
    writeThemePreference('dark', storage)
    expect(readThemePreference(storage)).toBe('dark')
  })

  it('survives storage being missing or throwing (Safari private mode, quota)', () => {
    expect(() => writeThemePreference('dark', null)).not.toThrow()
    expect(() =>
      writeThemePreference('dark', {
        getItem: () => null,
        setItem: () => {
          throw new Error('quota exceeded')
        },
      }),
    ).not.toThrow()
  })
})

describe('applyTheme', () => {
  function blankDocument(withMeta = true) {
    const html = document.implementation.createHTMLDocument('theme')
    if (withMeta) {
      const meta = html.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      meta.setAttribute('content', THEME_COLOR.light)
      html.head.appendChild(meta)
    }
    return html
  }

  const themeColorOf = (doc: Document) =>
    doc.querySelector('meta[name="theme-color"]')?.getAttribute('content')

  it('adds .dark to the root element and switches theme-color to the dark background', () => {
    const doc = blankDocument()
    applyTheme('dark', doc)
    expect(doc.documentElement.classList.contains('dark')).toBe(true)
    expect(themeColorOf(doc)).toBe(THEME_COLOR.dark)
  })

  it('removes .dark and restores the light theme-color', () => {
    const doc = blankDocument()
    applyTheme('dark', doc)
    applyTheme('light', doc)
    expect(doc.documentElement.classList.contains('dark')).toBe(false)
    expect(themeColorOf(doc)).toBe(THEME_COLOR.light)
  })

  it('is idempotent — applying the same theme twice leaves one class', () => {
    const doc = blankDocument()
    applyTheme('dark', doc)
    applyTheme('dark', doc)
    expect(doc.documentElement.className.trim()).toBe('dark')
  })

  it('still sets the class when the document has no theme-color meta (Storybook iframe)', () => {
    const doc = blankDocument(false)
    expect(() => applyTheme('dark', doc)).not.toThrow()
    expect(doc.documentElement.classList.contains('dark')).toBe(true)
  })
})

// The pre-paint bootstrap in index.html cannot import this module: it has to run before the bundle
// loads, or the first frame paints light and then flips. It therefore repeats the storage key, the
// media query and both theme-color values as literals. These assertions are the seam that keeps
// that copy honest — change a constant here without changing index.html and this fails.
describe('index.html pre-paint bootstrap', () => {
  // Vitest runs with the app package as its root, so index.html sits at the cwd. (import.meta.url
  // is an http:// URL under Vite's transform, hence not usable to locate it.)
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

  it('uses the same storage key as the theme module', () => {
    expect(html).toContain(`'${THEME_STORAGE_KEY}'`)
  })

  it('uses the same prefers-color-scheme query', () => {
    expect(html).toContain(DARK_COLOR_SCHEME_QUERY)
  })

  it('carries the same light and dark theme-color values', () => {
    expect(html).toContain(THEME_COLOR.light)
    expect(html).toContain(THEME_COLOR.dark)
  })
})
