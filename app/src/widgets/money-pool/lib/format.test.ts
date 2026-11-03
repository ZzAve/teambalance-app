import { describe, expect, it } from 'vitest'
import { formatBeers, formatEuro, formatPaymentDate } from './format'

// Intl separates the euro sign from the amount with a no-break space (U+00A0).
const NBSP = '\u00a0'

describe('formatEuro', () => {
  it('formats euro cents with a decimal comma', () => {
    expect(formatEuro(18750)).toBe(`€${NBSP}187,50`)
  })

  it('formats a single cent', () => {
    expect(formatEuro(1)).toBe(`€${NBSP}0,01`)
  })

  it('formats zero', () => {
    expect(formatEuro(0)).toBe(`€${NBSP}0,00`)
  })

  it('groups thousands with a dot', () => {
    expect(formatEuro(123456789)).toBe(`€${NBSP}1.234.567,89`)
  })
})

describe('formatPaymentDate', () => {
  it('shows day and short Dutch month', () => {
    expect(formatPaymentDate('2026-10-06')).toBe('6 okt')
  })
})

describe('formatBeers', () => {
  it('pluralises the count', () => {
    expect(formatBeers(69)).toBe('69 beers')
    expect(formatBeers(1)).toBe('1 beer')
    expect(formatBeers(0)).toBe('0 beers')
  })

  it('groups thousands with a dot', () => {
    expect(formatBeers(1250)).toBe('1.250 beers')
  })
})
