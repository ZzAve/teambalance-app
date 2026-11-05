import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { formatBeers, formatEuro, formatPaymentDate } from './format'

// Intl separates the euro sign from the amount with a no-break space (U+00A0) in nl-NL.
const NBSP = ' '

describe('formatEuro', () => {
  it('formats euro cents with a decimal point', () => {
    expect(formatEuro(18750)).toBe('€187.50')
  })

  it('formats a single cent', () => {
    expect(formatEuro(1)).toBe('€0.01')
  })

  it('formats zero', () => {
    expect(formatEuro(0)).toBe('€0.00')
  })

  it('groups thousands with a comma', () => {
    expect(formatEuro(123456789)).toBe('€1,234,567.89')
  })
})

describe('formatPaymentDate', () => {
  it('shows day and short month', () => {
    expect(formatPaymentDate('2026-10-06')).toBe('6 Oct')
  })
})

describe('formatBeers', () => {
  it('pluralises the count', () => {
    expect(formatBeers(69)).toBe('69 beers')
    expect(formatBeers(1)).toBe('1 beer')
    expect(formatBeers(0)).toBe('0 beers')
  })

  it('groups thousands with a comma', () => {
    expect(formatBeers(1250)).toBe('1,250 beers')
  })
})

describe('money pool formatting in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('formats euro with a decimal comma and a dot per thousand', async () => {
    await i18n.changeLanguage('nl')
    expect(formatEuro(18750)).toBe(`€${NBSP}187,50`)
    expect(formatEuro(123456789)).toBe(`€${NBSP}1.234.567,89`)
  })

  it('shows day and short Dutch month', async () => {
    await i18n.changeLanguage('nl')
    expect(formatPaymentDate('2026-10-06')).toBe('6 okt')
  })

  it('counts beers in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(formatBeers(1)).toBe('1 biertje')
    expect(formatBeers(1250)).toBe('1.250 biertjes')
  })
})
