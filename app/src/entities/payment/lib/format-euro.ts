import { formatLocale } from '@shared/i18n/i18n'

// Built once per locale, so a language switch takes effect on the next render (ADR-0043 §6).
const formatters = new Map<string, Intl.NumberFormat>()

/** Amounts arrive as euro cents. */
export function formatEuro(cents: number): string {
  const locale = formatLocale()
  let formatter = formatters.get(locale)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
    formatters.set(locale, formatter)
  }
  return formatter.format(cents / 100)
}
