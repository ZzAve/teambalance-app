import type { Payment } from '@shared/api/money-pool'
import { countsAsIncoming } from './toppers'

export interface BalancePoint {
  /** ISO calendar date of the payment this point follows; the first point sits on the oldest payment's date. */
  date: string
  /** Euro cents. */
  balance: number
}

/**
 * The pot balance over the payments' window, oldest first, rebuilt from the balance now and the
 * newest-first payment list: the first point is the balance before the oldest payment, then one point
 * after each payment, the last equal to `balanceNow`. An out-of-pocket expense never went through the
 * account, so it has no point.
 * shortcut: the API returns only the newest 200 payments, so with more than that the graph and the In and
 * Spent totals cover just those; switch to the bank's balance-after-mutation if that cap bites.
 */
export function balanceTimeline(balanceNow: number, payments: Payment[]): BalancePoint[] {
  const points: BalancePoint[] = []
  let balance = balanceNow
  const bankPayments = payments.filter((p) => !p.outOfPocket)
  for (const p of bankPayments) {
    points.push({ date: p.date, balance })
    balance -= p.direction === 'In' ? p.amount : -p.amount
  }
  const oldest = bankPayments.at(-1)
  if (oldest) points.push({ date: oldest.date, balance })
  return points.reverse()
}

/** Everything that came in and went out over the payments' window, in euro cents. An out-of-pocket expense is in both. */
export function potTotals(payments: Payment[]): { incoming: number; outgoing: number } {
  let incoming = 0
  let outgoing = 0
  for (const p of payments) {
    if (countsAsIncoming(p)) incoming += p.amount
    if (p.direction === 'Out') outgoing += p.amount
  }
  return { incoming, outgoing }
}
