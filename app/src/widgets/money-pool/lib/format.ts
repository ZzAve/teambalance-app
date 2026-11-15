import { formatLocale, i18n } from '@shared/i18n/i18n'

// Built once per locale, so a language switch takes effect on the next render (ADR-0043 §6).
const formatters = new Map<string, { count: Intl.NumberFormat; day: Intl.DateTimeFormat; weekday: Intl.DateTimeFormat }>()

function formattersFor(locale: string) {
  let found = formatters.get(locale)
  if (!found) {
    found = {
      count: new Intl.NumberFormat(locale),
      day: new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }),
    }
    formatters.set(locale, found)
  }
  return found
}

export function formatBeers(beers: number): string {
  return i18n.t('money.beers', { count: beers, formatted: formattersFor(formatLocale()).count.format(beers) })
}

/** `date` is an ISO calendar date such as "2026-10-06". */
export function formatPaymentDate(date: string): string {
  return formattersFor(formatLocale()).day.format(new Date(`${date}T00:00:00`))
}

/** Weekday, day and short month, such as "Sat 7 Nov". */
export function formatPaymentWeekday(date: string): string {
  return formattersFor(formatLocale()).weekday.format(new Date(`${date}T00:00:00`))
}
