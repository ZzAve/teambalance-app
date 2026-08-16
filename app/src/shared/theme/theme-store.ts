import { useEffect } from 'react'
import { create } from 'zustand'
import {
  applyTheme,
  DARK_COLOR_SCHEME_QUERY,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme'

/**
 * Dark-mode state (F11, #159): the user's preference, the theme it currently resolves to, and the
 * one hook that pushes that onto the document.
 *
 * Split of duties:
 *   - `index.html` applies the theme **before first paint** (it cannot wait for this bundle, or the
 *     first frame renders light and then flips).
 *   - this store owns the preference from then on, and
 *   - `useThemeSync()`, mounted once in the root layout, is the single place that writes to the DOM
 *     and the single subscriber to the OS preference.
 */

/**
 * The OS bit. Read on demand rather than cached: it can change under us, and reading it lazily
 * keeps the module importable where `matchMedia` doesn't exist (jsdom implements none), where
 * "no media query support" honestly means "not dark".
 */
function osPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches
}

function localStorageOrNull() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // Accessing localStorage itself throws when cookies are blocked.
    return null
  }
}

interface ThemeState {
  preference: ThemePreference
  resolved: ResolvedTheme
  /** Record an explicit choice (or a return to `system`), persist it, and re-resolve. */
  setPreference: (preference: ThemePreference) => void
  /** Re-resolve after the OS scheme changed. A no-op unless the preference is `system`. */
  syncSystemPreference: () => void
}

const initialPreference = readThemePreference(localStorageOrNull())

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: initialPreference,
  resolved: resolveTheme(initialPreference, osPrefersDark()),
  setPreference: (preference) => {
    writeThemePreference(preference, localStorageOrNull())
    set({ preference, resolved: resolveTheme(preference, osPrefersDark()) })
  },
  syncSystemPreference: () => set({ resolved: resolveTheme(get().preference, osPrefersDark()) }),
}))

/**
 * Mount once, at the root. Applies the resolved theme to the document and keeps it following the OS
 * while the preference is `system`. Returns the resolved theme so the caller can hand it to
 * components that need it as a value rather than a class — `sonner`'s `<Toaster theme>` is the one.
 */
export function useThemeSync(): ResolvedTheme {
  const resolved = useThemeStore((state) => state.resolved)
  const syncSystemPreference = useThemeStore((state) => state.syncSystemPreference)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(DARK_COLOR_SCHEME_QUERY)
    // Fires only while the preference is `system` in effect — the store's own guard — so an
    // explicit chooser is never yanked around by the OS.
    const onChange = () => syncSystemPreference()
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [syncSystemPreference])

  // Re-applied rather than assumed: the pre-paint script set the class for the *initial* theme, and
  // this covers every change after it — plus contexts where that script never ran (Storybook, e2e
  // fixtures rendering the tree directly).
  useEffect(() => {
    applyTheme(resolved, document)
  }, [resolved])

  return resolved
}
