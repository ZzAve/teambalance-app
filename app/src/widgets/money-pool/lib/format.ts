import { formatLocale, i18n } from '@shared/i18n/i18n'

// Built once per locale, so a language switch takes effect on the next render (ADR-0043 §6).
const formatters = new Map<string, { euro: Intl.NumberFormat; count: Intl.NumberFormat; day: Intl.DateTimeFormat; weekday: Intl.DateTimeFormat }>()

function formattersFor(locale: string) {
  let found = formatters.get(locale)
  if (!found) {
    found = {
      euro: new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }),
      count: new Intl.NumberFormat(locale),
      day: new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }),
    }
    formatters.set(locale, found)
  }
  return found
}

/** Amounts arrive as euro cents. */
export function formatEuro(cents: number): string {
  return formattersFor(formatLocale()).euro.format(cents / 100)
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

/** Two ISO calendar dates as one range, such as "19–25 Oct" or "26 Oct – 1 Nov", in the locale's own form. */
export function formatDateRange(from: string, to: string): string {
  return formattersFor(formatLocale()).day.formatRange(new Date(`${from}T00:00:00`), new Date(`${to}T00:00:00`))
}
