import type { Payment } from '@shared/api/money-pool'

export type TopperPeriod = 'season' | 'last30'

export interface Topper {
  memberId: string
  /** Euro cents. */
  total: number
  /** Standard competition rank: equal totals share a rank and the next rank is skipped (1, 1, 3). */
  rank: number
}

/** Ranks member totals: total descending, then display name; ties share a rank. Every id in `memberIds` is ranked, at zero if it has no total. */
export function rankTotals(totals: Map<string, number>, nameOf: (memberId: string) => string, memberIds: readonly string[] = []): Topper[] {
  const all = new Map(totals)
  for (const id of memberIds) if (!all.has(id)) all.set(id, 0) // roster members without a top-up rank at zero
  const sorted = [...all].sort(([ia, ta], [ib, tb]) => tb - ta || nameOf(ia).localeCompare(nameOf(ib)))
  const ranked: Topper[] = []
  sorted.forEach(([memberId, total], i) => {
    const previous = ranked[i - 1]
    ranked.push({ memberId, total, rank: previous?.total === total ? previous.rank : i + 1 })
  })
  return ranked
}

/** ISO calendar date `days` before `date`. Calendar arithmetic in UTC, so no DST or zone shifts. */
function daysBefore(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10)
}

/** The payments in the period; Last 30 days is `date >= today − 30` by calendar date, inclusive. Season is what the API returned. */
export function periodPayments(payments: Payment[], period: TopperPeriod, today: string): Payment[] {
  if (period === 'season') return payments
  const from = daysBefore(today, 30)
  return payments.filter((p) => p.date >= from)
}

/**
 * Money that came in, or an out-of-pocket expense: the member paid it with their own money, which counts
 * as a contribution of the same amount (ADR-0048).
 */
export function countsAsIncoming(payment: Payment): boolean {
  return payment.direction === 'In' || payment.outOfPocket
}

/** Everything attributed to a member that came in, in euro cents. */
export function toppedUpTotal(payments: Payment[]): number {
  return payments.reduce((sum, p) => (countsAsIncoming(p) && p.memberId ? sum + p.amount : sum), 0)
}

/** Who topped up most in the period, the attributed total, and the incoming money without a member. */
export function toppers(payments: Payment[], period: TopperPeriod, today: string, nameOf: (memberId: string) => string, memberIds: readonly string[] = []) {
  const totals = new Map<string, number>()
  let incoming = 0
  for (const p of periodPayments(payments, period, today)) {
    if (!countsAsIncoming(p)) continue
    incoming += p.amount
    if (p.memberId) totals.set(p.memberId, (totals.get(p.memberId) ?? 0) + p.amount)
  }
  const toppedUp = [...totals.values()].reduce((a, b) => a + b, 0)
  return { ranking: rankTotals(totals, nameOf, memberIds), toppedUp, unmatched: incoming - toppedUp }
}

/**
 * The podium is the top 3 with money; everyone else, members at zero included, goes in the list below it.
 * Members with an equal total are never split: a tie that does not fit in the 3 places goes to the list as a whole.
 */
export function splitPodium(ranking: Topper[]): { podium: Topper[]; rest: Topper[] } {
  const tiedBeyondThird = ranking[3] && ranking[3].total > 0 ? ranking[3].rank : undefined
  const podium = ranking.slice(0, 3).filter((r) => r.total > 0 && r.rank !== tiedBeyondThird)
  return { podium, rest: ranking.slice(podium.length) }
}
