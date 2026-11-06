import { appPreferenceKey, browserPreferenceStorage, readPreference, writePreference } from '../preferences/preferences'
import { i18n, LANGUAGES, type Language } from './i18n'

const STORAGE_KEY = appPreferenceKey('language')

const parseLanguage = (raw: unknown): Language | null =>
  LANGUAGES.find((language) => language === raw) ?? null

/**
 * The language to show (ADR-0043 §3): the signed-in user's choice, then the device's, then the first
 * browser language that is Dutch or English (any region), then English.
 */
export function resolveLanguage({
  user,
  stored,
  browser,
}: {
  user: 'NL' | 'EN' | null | undefined
  stored: Language | null
  browser: readonly string[]
}): Language {
  if (user) return user === 'NL' ? 'nl' : 'en'
  if (stored) return stored
  for (const tag of browser) {
    const match = parseLanguage(tag.toLowerCase().split('-')[0])
    if (match) return match
  }
  return 'en'
}

/** At boot, before any user is known: the device's value, else the browser's. */
export function startLanguage(): void {
  const stored = readPreference(browserPreferenceStorage(), STORAGE_KEY, parseLanguage)
  void i18n.changeLanguage(resolveLanguage({ user: null, stored, browser: navigator.languages ?? [] }))
}

/**
 * Applies a language the user chose (now, or on another device), and keeps it on this device too, so
 * the next logged-out page here already speaks it. A user who never chose leaves the device's alone.
 */
export function applyUserLanguage(user: 'NL' | 'EN' | null | undefined): void {
  if (!user) return
  const language = resolveLanguage({ user, stored: null, browser: [] })
  writePreference(browserPreferenceStorage(), STORAGE_KEY, language)
  if (i18n.language !== language) void i18n.changeLanguage(language)
}
