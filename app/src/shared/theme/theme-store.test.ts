import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DARK_COLOR_SCHEME_QUERY, THEME_STORAGE_KEY } from './theme'
import { useThemeStore } from './theme-store'

// The store's job is small but load-bearing: hold the preference, persist it, and keep `resolved`
// in step with the OS while the preference is `system`. jsdom implements no matchMedia at all, so
// the OS bit is stubbed here — which also lets the "OS flipped while the app is open" case be
// driven deterministically.

let prefersDark = false
const listeners = new Set<() => void>()

/** Flip the stubbed OS preference and fire the `change` listeners the store subscribed with. */
function setOsPrefersDark(next: boolean) {
  prefersDark = next
  listeners.forEach((listener) => listener())
}

beforeEach(() => {
  prefersDark = false
  listeners.clear()
  localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    matches: query === DARK_COLOR_SCHEME_QUERY ? prefersDark : false,
    addEventListener: (_: string, listener: () => void) => void listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => void listeners.delete(listener),
  }))
  useThemeStore.setState({ preference: 'system', resolved: 'light' })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('theme-store', () => {
  it('defaults to the system preference', () => {
    expect(useThemeStore.getState().preference).toBe('system')
  })

  it.each(['light', 'dark'] as const)('resolves and persists an explicit "%s" choice', (pref) => {
    useThemeStore.getState().setPreference(pref)

    expect(useThemeStore.getState()).toMatchObject({ preference: pref, resolved: pref })
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(pref)
  })

  it('resolves "system" against the OS preference at the moment of the choice', () => {
    setOsPrefersDark(true)
    useThemeStore.getState().setPreference('system')

    expect(useThemeStore.getState().resolved).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system')
  })

  it('follows the OS when it flips while the preference is system', () => {
    useThemeStore.getState().setPreference('system')
    expect(useThemeStore.getState().resolved).toBe('light')

    setOsPrefersDark(true)
    useThemeStore.getState().syncSystemPreference()

    expect(useThemeStore.getState().resolved).toBe('dark')
  })

  it('ignores an OS flip once the user has chosen explicitly', () => {
    useThemeStore.getState().setPreference('light')

    setOsPrefersDark(true)
    useThemeStore.getState().syncSystemPreference()

    expect(useThemeStore.getState().resolved).toBe('light')
  })

  it('treats a missing matchMedia as "OS prefers light" rather than throwing', () => {
    vi.stubGlobal('matchMedia', undefined)

    expect(() => useThemeStore.getState().setPreference('system')).not.toThrow()
    expect(useThemeStore.getState().resolved).toBe('light')
  })
})
