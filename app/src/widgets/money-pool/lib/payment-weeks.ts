import type { Payment } from '@shared/api/money-pool'
import { i18n } from '@shared/i18n/i18n'
import { formatDateRange } from './format'

export interface PaymentWeek {
  /** ISO calendar date of the week's Monday. */
  monday: string
  /** In the order given (newest first). */
  payments: Payment[]
}

/** ISO calendar date `days` after `date`. Calendar arithmetic in UTC, so no DST or zone shifts. */
function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10)
}

/** The Monday on or before `date`; weeks start on Monday. */
export function mondayOf(date: string): string {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay() // 0 is Sunday
  return addDays(date, -((weekday + 6) % 7))
}

/** The payments grouped by week, in the order the payments come (the API sends newest first). */
export function paymentWeeks(payments: Payment[]): PaymentWeek[] {
  const weeks = new Map<string, PaymentWeek>()
  for (const p of payments) {
    const monday = mondayOf(p.date)
    let week = weeks.get(monday)
    if (!week) weeks.set(monday, (week = { monday, payments: [] }))
    week.payments.push(p)
  }
  return [...weeks.values()]
}

/** The first whole weeks that hold at least `shown` payments, so a week is never split. */
export function firstWeeks(weeks: PaymentWeek[], shown: number): PaymentWeek[] {
  const kept: PaymentWeek[] = []
  let count = 0
  for (const week of weeks) {
    if (count >= shown) break
    kept.push(week)
    count += week.payments.length
  }
  return kept
}

/** "This week", "Last week", or the Monday to Sunday range in the current language. */
export function weekLabel(monday: string, today: string): string {
  const thisMonday = mondayOf(today)
  if (monday === thisMonday) return i18n.t('money.thisWeek')
  if (monday === addDays(thisMonday, -7)) return i18n.t('money.lastWeek')
  return formatDateRange(monday, addDays(monday, 6))
}
