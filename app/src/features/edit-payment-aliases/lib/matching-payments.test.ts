import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { matchingPayments } from './matching-payments'

const pay = (over: Partial<Payment>): Payment => ({
  id: 'p',
  date: '2026-01-01',
  name: 'X',
  amount: 10,
  direction: 'In',
  receiptVersion: undefined,
  memberId: undefined,
  counterpartyName: undefined,
  ...over,
})

describe('matchingPayments', () => {
  const payments = [
    pay({ id: '1', name: 'I.M. VISSER', amount: 12.5 }),
    pay({ id: '2', name: 'i.m.  visser', amount: 7.5 }),
    pay({ id: '3', name: 'I.M. VISSER', memberId: 'u2' }),
    pay({ id: '4', name: 'I.M. VISSER', direction: 'Out' }),
    pay({ id: '5', name: 'Other' }),
    pay({ id: '6', name: 'Iris V', counterpartyName: 'I.M. Visser', amount: 5 }),
  ]

  it('counts and sums unattributed incoming payments with the same normalised name', () => {
    expect(matchingPayments('  I.M.  visser', payments)).toEqual({ count: 3, total: 25 })
  })
  it('is zero for a blank name', () => {
    expect(matchingPayments('  ', payments)).toEqual({ count: 0, total: 0 })
  })
})
