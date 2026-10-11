import { describe, expect, it } from 'vitest'
import { formatEuro, formatPaymentDate } from './format'

describe('formatEuro', () => {
  it('formats euro cents with a decimal comma', () => {
    expect(formatEuro(18750).replace(/\s/g, ' ')).toBe('€ 187,50')
  })

  it('formats a single cent', () => {
    expect(formatEuro(1).replace(/\s/g, ' ')).toBe('€ 0,01')
  })
})

describe('formatPaymentDate', () => {
  it('shows day and short month', () => {
    expect(formatPaymentDate('2026-10-06')).toBe('6 Oct')
  })
})
