import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { formatBeers, formatPaymentDate, formatPaymentWeekday } from './format'

afterEach(() => i18n.changeLanguage('en'))

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
