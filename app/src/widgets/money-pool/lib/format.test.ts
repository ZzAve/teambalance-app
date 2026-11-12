import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { formatBeers, formatEuro, formatPaymentDate, formatPaymentWeekday } from './format'

// Intl separates the euro sign from the amount with a no-break space (U+00A0) in Dutch.
const NBSP = ' '

afterEach(() => i18n.changeLanguage('en'))

describe('formatEuro', () => {
  it('formats euro cents with a decimal point in English', () => {
    expect(formatEuro(18750)).toBe('€187.50')
  })

  it('formats a single cent', () => {
    expect(formatEuro(1)).toBe('€0.01')
  })

  it('formats zero', () => {
    expect(formatEuro(0)).toBe('€0.00')
  })

  it('groups thousands with a comma in English', () => {
    expect(formatEuro(123456789)).toBe('€1,234,567.89')
  })

  it('follows the language: decimal comma and thousands dot in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(formatEuro(123456789)).toBe(`€${NBSP}1.234.567,89`)
  })
})

describe('formatPaymentDate', () => {
  it('shows day and short month', () => {
    expect(formatPaymentDate('2026-10-06')).toBe('6 Oct')
  })

  it('shows the Dutch month in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(formatPaymentDate('2026-10-06')).toBe('6 okt')
  })
})

describe('formatBeers', () => {
  it('pluralises the count', () => {
    expect(formatBeers(69)).toBe('69 beers')
    expect(formatBeers(1)).toBe('1 beer')
    expect(formatBeers(0)).toBe('0 beers')
  })

  it('groups thousands with a comma in English', () => {
    expect(formatBeers(1250)).toBe('1,250 beers')
  })
})

describe('formatPaymentWeekday', () => {
  it('shows the weekday before the day and month', async () => {
    expect(formatPaymentWeekday('2026-11-07')).toBe('Sat 7 Nov')
    await i18n.changeLanguage('nl')
    expect(formatPaymentWeekday('2026-11-07')).toBe('za 7 nov')
  })
})
