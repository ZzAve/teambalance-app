import type { Payment } from '@shared/api/money-pool'

export interface BalancePoint {
  /** ISO calendar date of the payment this point follows; the first point sits on the oldest payment's date. */
  date: string
  /** Euro cents. */
  balance: number
}

/**
 * The pot balance over the payments' window, oldest first, rebuilt from the balance now and the
 * newest-first payment list: the first point is the balance before the oldest payment, then one point
 * after each payment, the last equal to `balanceNow`.
 * shortcut: the API returns only the newest 200 payments, so with more than that the graph and the In and
 * Spent totals cover just those; switch to the bank's balance-after-mutation if that cap bites.
 */
export function balanceTimeline(balanceNow: number, payments: Payment[]): BalancePoint[] {
  const points: BalancePoint[] = []
  let balance = balanceNow
  for (const p of payments) {
    points.push({ date: p.date, balance })
    balance -= p.direction === 'In' ? p.amount : -p.amount
  }
  const oldest = payments.at(-1)
  if (oldest) points.push({ date: oldest.date, balance })
  return points.reverse()
}

/** Everything that came in and went out over the payments' window, in euro cents. */
export function potTotals(payments: Payment[]): { incoming: number; outgoing: number } {
  let incoming = 0
  let outgoing = 0
  for (const p of payments) {
    if (p.direction === 'In') incoming += p.amount
    else outgoing += p.amount
  }
  return { incoming, outgoing }
}
