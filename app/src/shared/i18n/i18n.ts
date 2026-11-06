import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import nl from './locales/nl.json'

/** The languages TeamBalance speaks (ADR-0043). A third is a new catalogue plus an entry here. */
export const LANGUAGES = ['nl', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

export const resources = { en: { translation: en }, nl: { translation: nl } } as const

// Bundled catalogues and a synchronous init: no fetch (the PWA works offline) and no render before the
// words exist. English is the start language, so every test and story is English unless it says
// otherwise; the app itself switches at boot (`startLanguage`).
void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  initAsync: false,
})

// `<html lang>` follows, so screen readers and the browser's hyphenation use the right language.
i18n.on('languageChanged', (language) => {
  if (typeof document !== 'undefined') document.documentElement.lang = language
})

export { i18n }

/** The `Intl` locale for dates and money in the current language (ADR-0043 §6). */
export function formatLocale(language: string = i18n.language): string {
  return language === 'nl' ? 'nl-NL' : 'en-GB'
}
