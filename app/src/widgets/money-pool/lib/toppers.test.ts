import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { periodPayments, toppedUpTotal, toppers } from './toppers'

const pay = (date: string, amount: number, memberId?: string, direction: Payment['direction'] = 'In'): Payment => ({
  id: `${date}-${amount}-${memberId}-${direction}`,
  date,
  name: 'x',
  amount,
  direction,
  memberId,
  counterpartyName: undefined,
  receiptVersion: undefined,
})
const names: Record<string, string> = { a: 'Anna', b: 'Bram', c: 'Cleo', d: 'Dirk' }
const nameOf = (id: string) => names[id] ?? 'Former member'
const TODAY = '2026-11-09'

describe('toppers', () => {
  it('sums incoming payments per member in cents and ranks by total', () => {
    const r = toppers([pay('2026-10-01', 10, 'a'), pay('2026-10-02', 20, 'b'), pay('2026-10-03', 20, 'a')], 'season', TODAY, nameOf)
    expect(r.ranking).toEqual([
      { memberId: 'a', total: 30, rank: 1 },
      { memberId: 'b', total: 20, rank: 2 },
    ])
    expect(r.toppedUp).toBe(50)
  })

  it('adds cents without floating point drift', () => {
    const r = toppers([pay('2026-10-01', 10, 'a'), pay('2026-10-02', 20, 'a')], 'season', TODAY, nameOf)
    expect(r.ranking[0].total).toBe(30)
  })

  it('shares a rank on a tie, then orders by display name and skips the next rank', () => {
    const r = toppers([pay('2026-10-01', 500, 'c'), pay('2026-10-01', 500, 'a'), pay('2026-10-01', 100, 'b')], 'season', TODAY, nameOf)
    expect(r.ranking.map((x) => [x.memberId, x.rank])).toEqual([['a', 1], ['c', 1], ['b', 3]])
  })

  it('ignores outgoing payments and counts incoming without a member only as unmatched', () => {
    const r = toppers([pay('2026-10-01', 700, 'a'), pay('2026-10-01', 300), pay('2026-10-02', 900, 'a', 'Out')], 'season', TODAY, nameOf)
    expect(r.ranking).toEqual([{ memberId: 'a', total: 700, rank: 1 }])
    expect(r.toppedUp).toBe(700)
    expect(r.unmatched).toBe(300)
  })

  it('last30 keeps a payment exactly 30 days old and drops 31 days', () => {
    // 2026-11-09 minus 30 days is 2026-10-10.
    const r = toppers([pay('2026-10-10', 100, 'a'), pay('2026-10-09', 400, 'b')], 'last30', TODAY, nameOf)
    expect(r.ranking).toEqual([{ memberId: 'a', total: 100, rank: 1 }])
  })

  it('counts 30 days back across a year boundary', () => {
    expect(periodPayments([pay('2025-12-02', 1), pay('2025-12-01', 1)], 'last30', '2026-01-01').map((p) => p.date)).toEqual(['2025-12-02'])
  })

  it('has nothing to rank for an empty pool', () => {
    expect(toppers([], 'season', TODAY, nameOf)).toEqual({ ranking: [], toppedUp: 0, unmatched: 0 })
  })

  it('toppedUpTotal sums attributed incoming payments only', () => {
    expect(toppedUpTotal([pay('2026-10-01', 5, 'a'), pay('2026-10-01', 7), pay('2026-10-01', 9, 'a', 'Out')])).toBe(5)
  })
})
