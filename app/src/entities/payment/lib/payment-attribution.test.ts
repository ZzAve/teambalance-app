import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { isAttributedTopUp, isTopUpBy, isUnattributedIncoming } from './payment-attribution'

const payment = (overrides: Partial<Payment>): Payment => ({
  id: 'p1',
  date: '2026-10-06',
  name: 'Sam',
  amount: 1000,
  direction: 'In',
  receiptVersion: undefined,
  memberId: undefined,
  counterpartyName: undefined,
  ...overrides,
})

describe('isAttributedTopUp', () => {
  it('is true for an incoming payment with a Member', () => {
    expect(isAttributedTopUp(payment({ memberId: 'm1' }))).toBe(true)
  })

  it('is false for an incoming payment without a Member', () => {
    expect(isAttributedTopUp(payment({ memberId: undefined }))).toBe(false)
  })

  it('treats an empty member id as no Member', () => {
    expect(isAttributedTopUp(payment({ memberId: '' }))).toBe(false)
  })

  it('is false for an outgoing payment', () => {
    expect(isAttributedTopUp(payment({ direction: 'Out', memberId: 'm1' }))).toBe(false)
  })
})

describe('isUnattributedIncoming', () => {
  it('is true for an incoming payment without a Member, including an empty member id', () => {
    expect(isUnattributedIncoming(payment({ memberId: undefined }))).toBe(true)
    expect(isUnattributedIncoming(payment({ memberId: '' }))).toBe(true)
  })

  it('is false for an attributed or an outgoing payment', () => {
    expect(isUnattributedIncoming(payment({ memberId: 'm1' }))).toBe(false)
    expect(isUnattributedIncoming(payment({ direction: 'Out' }))).toBe(false)
  })
})

describe('isTopUpBy', () => {
  it('is true only for an incoming payment attributed to that Member', () => {
    expect(isTopUpBy(payment({ memberId: 'm1' }), 'm1')).toBe(true)
    expect(isTopUpBy(payment({ memberId: 'm2' }), 'm1')).toBe(false)
    expect(isTopUpBy(payment({ memberId: 'm1', direction: 'Out' }), 'm1')).toBe(false)
  })
})
