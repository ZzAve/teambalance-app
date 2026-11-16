import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { attributedMatchCount, matchingPayments } from './matching-payments'

const pay = (over: Partial<Payment>): Payment => ({
  id: 'p',
  date: '2026-01-01',
  name: 'X',
  amount: 10,
  direction: 'In',
  receiptVersion: undefined,
  outOfPocket: false,
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

  it('counts unattributed incoming payments with the same normalised name', () => {
    expect(matchingPayments('  I.M.  visser', payments)).toBe(3)
  })
  it('is zero for a blank name', () => {
    expect(matchingPayments('  ', payments)).toBe(0)
  })
})

describe('attributedMatchCount', () => {
  const mine = (over: Partial<Payment>) => pay({ memberId: 'u1', counterpartyName: 'I.M. VISSER', ...over })
  const payments = [
    mine({ id: '1' }),
    mine({ id: '2', counterpartyName: 'i.m.  visser' }),
    mine({ id: '3', memberId: 'u2' }),
    mine({ id: '4', direction: 'Out' }),
    mine({ id: '5', counterpartyName: 'Other' }),
    mine({ id: '6', counterpartyName: undefined }),
    pay({ id: '7', counterpartyName: 'I.M. VISSER' }),
  ]

  it('counts incoming payments attributed to this member with the same normalised counterparty name', () => {
    expect(attributedMatchCount(' I.M. Visser', 'u1', payments)).toBe(2)
  })
  it('counts nothing when the viewer gets no counterparty names', () => {
    expect(attributedMatchCount('I.M. Visser', 'u1', payments.map((p) => ({ ...p, counterpartyName: undefined })))).toBe(0)
  })
})
