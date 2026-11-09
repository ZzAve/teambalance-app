import { describe, expect, it } from 'vitest'
import { claimBody, failure } from './payment-aliases'

describe('failure (claiming a payment)', () => {
  it.each([
    [409, 'PAYMENT_NOT_CLAIMABLE', 'NOT_CLAIMABLE'],
    [409, 'MONEY_POOL_NOT_READABLE', 'POOL_UNAVAILABLE'],
    [503, undefined, 'POOL_UNAVAILABLE'],
    [409, 'PAYMENT_ALIAS_TAKEN', 'ALIAS_TAKEN'],
    [400, undefined, 'INVALID'],
    [404, undefined, 'NOT_FOUND'],
  ])('maps %i %s to %s', (status, code, expected) => {
    expect(failure({ status, body: code ? { code } : undefined }).code).toBe(expected)
  })
})

describe('claimBody', () => {
  // The server requires an explicitly requested name (400 for a blank one) but falls back to the IBAN
  // alone on its defaults, so "on" is sent as absent.
  it.each([
    [true, true, { userId: 'u' }],
    [true, false, { userId: 'u', useIban: false }],
    [false, true, { userId: 'u', useName: false }],
    [false, false, { userId: 'u', useName: false, useIban: false }],
  ])('useName %s, useIban %s', (useName, useIban, expected) => {
    expect(claimBody({ userId: 'u', useName, useIban })).toEqual(expected)
  })
})
