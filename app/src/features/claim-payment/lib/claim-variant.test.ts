import { describe, expect, it } from 'vitest'
import type { ActAs } from '@shared/api/generated/model/ActAs'
import type { Payment } from '@shared/api/money-pool'
import { claimVariant } from './claim-variant'

const ACT_AS = {} as ActAs

const payment = (over: Partial<Payment> = {}): Payment => ({
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

describe('claimVariant', () => {
  it('gives a member the "That\'s mine" control', () => {
    expect(claimVariant({ role: 'MEMBER' }, payment())).toBe('member')
  })
  it('gives an Admin the picker, also when acting as the team', () => {
    expect(claimVariant({ role: 'ADMIN' }, payment())).toBe('admin')
    expect(claimVariant({ role: 'ADMIN', actAs: ACT_AS }, payment())).toBe('admin')
  })
  it('gives nobody a control when acting as a team without Admin rights: a Platform Admin is no member', () => {
    expect(claimVariant({ role: undefined, actAs: ACT_AS }, payment())).toBeNull()
    expect(claimVariant({ role: 'MEMBER', actAs: ACT_AS }, payment())).toBeNull()
  })
  it('gives no control on outgoing or attributed payments, or without a user', () => {
    expect(claimVariant({ role: 'ADMIN' }, payment({ direction: 'Out' }))).toBeNull()
    expect(claimVariant({ role: 'MEMBER' }, payment({ memberId: 'u1' }))).toBeNull()
    expect(claimVariant(null, payment())).toBeNull()
  })
})
