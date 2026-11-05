import { formatLocale, i18n } from '@shared/i18n/i18n'

/** Amounts arrive as euro cents. */
export function formatEuro(cents: number): string {
  return new Intl.NumberFormat(formatLocale(), { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export function formatBeers(beers: number): string {
  return i18n.t('moneyPool.beers', { count: beers, formatted: new Intl.NumberFormat(formatLocale()).format(beers) })
}

/** `date` is an ISO calendar date such as "2026-10-06". */
export function formatPaymentDate(date: string): string {
  return new Intl.DateTimeFormat(formatLocale(), { day: 'numeric', month: 'short' }).format(new Date(`${date}T00:00:00`))
}
