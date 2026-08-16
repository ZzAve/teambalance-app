/**
 * Theme primitives (F11, #159) — the pure half of dark mode.
 *
 * Nothing here reads a global: the storage and the document are arguments, so the whole
 * preference → resolved-theme decision is a plain unit under test. The React/zustand wiring that
 * supplies those globals lives in `theme-store.ts`.
 */

/** What the user asked for. `system` is the default and defers to the OS. */
export type ThemePreference = 'system' | 'light' | 'dark'

/** What actually renders — `system` has been resolved away. */
export type ResolvedTheme = 'light' | 'dark'

/** Same `tb-` prefixed convention as the other client-side keys (see shared/api/invitations.ts). */
export const THEME_STORAGE_KEY = 'tb-theme'

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

/**
 * The `<meta name="theme-color">` value per theme — what browser chrome (Android address bar, the
 * installed-app title bar) paints itself. Both are the `--color-background` of their theme, so the
 * chrome and the page meet without a seam.
 *
 * These literals are also repeated in `index.html`'s pre-paint bootstrap and asserted equal by
 * `theme.test.ts`; the manifest's own `theme_color` is install-time and cannot follow the theme
 * (see src/app/pwa/manifest.ts).
 */
export const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#F8F6F0',
  dark: '#141210',
}

/** The slice of `Storage` this module needs — so a test can hand it a Map and nothing else. */
export interface ThemeStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark']

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (PREFERENCES as readonly string[]).includes(value)
}

/**
 * The persisted preference, or `system` for anything else: nothing stored yet, a value written by
 * an older/newer build, or storage that refuses to be read (Safari private mode throws on access).
 * Falling back to `system` is the safe default — the user still gets the theme their OS asked for.
 */
export function readThemePreference(storage: ThemeStorage | null | undefined): ThemePreference {
  try {
    const stored = storage?.getItem(THEME_STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** Persists the preference. A theme choice is never worth breaking the app over, so this swallows. */
export function writeThemePreference(
  preference: ThemePreference,
  storage: ThemeStorage | null | undefined,
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Storage unavailable (private mode, quota, disabled cookies) — the choice just won't survive
    // a reload. The current session still switches.
  }
}

/** The whole decision: an explicit choice wins; `system` defers to the OS. */
export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

/**
 * Puts the resolved theme on the document: the `.dark` class the `dark:` variant keys off
 * (`@custom-variant dark (&:is(.dark *))` in global.css) and, with it, the dark token layer that
 * every `--color-*` consumer inherits — plus the `theme-color` meta so the browser chrome follows.
 *
 * The meta tag is optional on purpose: the Storybook iframe has none, and a missing address-bar
 * colour is not a reason to skip the class.
 */
export function applyTheme(resolved: ResolvedTheme, doc: Document): void {
  doc.documentElement.classList.toggle('dark', resolved === 'dark')
  doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[resolved])
}
