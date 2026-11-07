import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { balanceTimeline, potTotals } from './balance-timeline'

const payment = (date: string, amount: number, direction: Payment['direction']): Payment => ({ id: 'p', date, name: 'x', amount, direction, receiptVersion: undefined })

describe('balanceTimeline', () => {
  it('has no points without payments', () => {
    expect(balanceTimeline(18750, [])).toEqual([])
  })

  it('starts at the balance before a single payment and ends at the current balance', () => {
    expect(balanceTimeline(3000, [payment('2026-10-06', 2000, 'In')])).toEqual([
      { date: '2026-10-06', balance: 1000 },
      { date: '2026-10-06', balance: 3000 },
    ])
  })

  it('walks a newest-first list back and returns the points oldest first', () => {
    const payments = [
      payment('2026-10-06', 2000, 'In'),
      payment('2026-10-04', 4500, 'Out'),
      payment('2026-09-29', 1000, 'In'),
    ]

    expect(balanceTimeline(18750, payments)).toEqual([
      { date: '2026-09-29', balance: 20250 },
      { date: '2026-09-29', balance: 21250 },
      { date: '2026-10-04', balance: 16750 },
      { date: '2026-10-06', balance: 18750 },
    ])
  })

  it('keeps one point per payment when several land on the same day', () => {
    const points = balanceTimeline(500, [payment('2026-10-06', 100, 'In'), payment('2026-10-06', 100, 'In')])

    expect(points.map((p) => p.balance)).toEqual([300, 400, 500])
  })

  it('always ends at the current balance', () => {
    const points = balanceTimeline(777, [payment('2026-10-06', 30, 'Out'), payment('2026-10-01', 10, 'In')])

    expect(points.at(-1)?.balance).toBe(777)
  })
})

describe('potTotals', () => {
  it('sums incoming and outgoing separately', () => {
    const payments = [payment('2026-10-06', 2000, 'In'), payment('2026-10-04', 4500, 'Out'), payment('2026-09-29', 1000, 'In')]

    expect(potTotals(payments)).toEqual({ incoming: 3000, outgoing: 4500 })
  })

  it('is zero without payments', () => {
    expect(potTotals([])).toEqual({ incoming: 0, outgoing: 0 })
  })
})
