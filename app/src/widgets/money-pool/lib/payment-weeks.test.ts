import { afterEach, describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { i18n } from '@shared/i18n/i18n'
import { firstWeeks, mondayOf, paymentWeeks, weekLabel } from './payment-weeks'

const pay = (date: string, amount: number, direction: Payment['direction'] = 'In'): Payment => ({
  id: `${date}-${amount}`,
  date,
  name: 'x',
  amount,
  direction,
  memberId: undefined,
  counterpartyName: undefined,
  receiptVersion: undefined,
})

afterEach(() => i18n.changeLanguage('en'))

describe('mondayOf', () => {
  it('is the date itself on a Monday', () => {
    expect(mondayOf('2026-11-09')).toBe('2026-11-09')
  })

  it('goes back to Monday from later in the week, Sunday included', () => {
    expect(mondayOf('2026-11-12')).toBe('2026-11-09')
    expect(mondayOf('2026-11-15')).toBe('2026-11-09')
  })

  it('crosses a month and a year', () => {
    expect(mondayOf('2026-11-01')).toBe('2026-10-26')
    expect(mondayOf('2027-01-02')).toBe('2026-12-28')
  })
})

describe('paymentWeeks', () => {
  // Newest first, like the API.
  const PAYMENTS = [pay('2026-11-11', 1845, 'Out'), pay('2026-11-10', 1500), pay('2026-11-08', 2000), pay('2026-11-07', 4500, 'Out'), pay('2026-11-01', 1500)]

  it('groups by the Monday of the week, newest week first, keeping the order inside a week', () => {
    const weeks = paymentWeeks(PAYMENTS)
    expect(weeks.map((w) => w.monday)).toEqual(['2026-11-09', '2026-11-02', '2026-10-26'])
    expect(weeks[1].payments.map((p) => p.date)).toEqual(['2026-11-08', '2026-11-07'])
  })

  it('has no weeks without payments', () => {
    expect(paymentWeeks([])).toEqual([])
  })
})

describe('firstWeeks', () => {
  const week = (monday: string, count: number) => ({ monday, payments: Array.from({ length: count }, (_, i) => pay(monday, i)) })

  it('keeps whole weeks until at least the asked number of payments is shown', () => {
    const weeks = [week('2026-11-09', 6), week('2026-11-02', 7), week('2026-10-26', 4), week('2026-10-19', 3)]
    // 6 + 7 = 13 is short of 15, so the third week comes in whole: 17 payments, never a split week.
    expect(firstWeeks(weeks, 15).map((w) => w.monday)).toEqual(['2026-11-09', '2026-11-02', '2026-10-26'])
  })

  it('stops exactly at a boundary that lands on the number', () => {
    const weeks = [week('2026-11-09', 10), week('2026-11-02', 5), week('2026-10-26', 1)]
    expect(firstWeeks(weeks, 15).map((w) => w.monday)).toEqual(['2026-11-09', '2026-11-02'])
  })

  it('keeps a first week bigger than the number whole', () => {
    expect(firstWeeks([week('2026-11-09', 20), week('2026-11-02', 1)], 15)).toHaveLength(1)
  })
})

describe('weekLabel', () => {
  const TODAY = '2026-11-12' // a Thursday

  it('names this week and last week', () => {
    expect(weekLabel('2026-11-09', TODAY)).toBe('This week')
    expect(weekLabel('2026-11-02', TODAY)).toBe('Last week')
  })

  it('shows older weeks as a Monday to Sunday range', () => {
    expect(weekLabel('2026-10-19', TODAY)).toMatch(/^19\s*–\s*25 Oct$/)
    expect(weekLabel('2026-10-26', TODAY)).toMatch(/^26 Oct\s*–\s*1 Nov$/)
  })

  it('follows the language', async () => {
    await i18n.changeLanguage('nl')
    expect(weekLabel('2026-11-09', TODAY)).toBe('Deze week')
    expect(weekLabel('2026-11-02', TODAY)).toBe('Vorige week')
    expect(weekLabel('2026-10-26', TODAY)).toMatch(/^26 okt\s*–\s*1 nov$/)
  })
})
