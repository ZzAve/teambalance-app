import { describe, expect, it } from 'vitest'
import { formatExpenseAmount, parseExpenseAmount } from './amount'

describe('parseExpenseAmount', () => {
  it('reads euros with a comma or a point, with at most two decimals, as cents', () => {
    expect(parseExpenseAmount('12')).toBe(1200)
    expect(parseExpenseAmount('12,5')).toBe(1250)
    expect(parseExpenseAmount('12.50')).toBe(1250)
    expect(parseExpenseAmount(' 0,01 ')).toBe(1)
    expect(parseExpenseAmount('19,99')).toBe(1999)
    expect(parseExpenseAmount('10000')).toBe(1_000_000)
  })

  it('rejects zero, more than € 10,000, a third decimal, signs, text and an empty field', () => {
    for (const text of ['0', '0,00', '10000,01', '1,234', '-5', '€5', 'abc', '', '1.2.3', '1 000']) {
      expect(parseExpenseAmount(text)).toBeNull()
    }
  })
})

describe('formatExpenseAmount', () => {
  it('writes cents as euros with a comma and two decimals, which parseExpenseAmount reads back', () => {
    expect(formatExpenseAmount(1250)).toBe('12,50')
    expect(formatExpenseAmount(1)).toBe('0,01')
    expect(formatExpenseAmount(1_000_000)).toBe('10000,00')
    for (const cents of [1, 99, 1250, 123_456]) expect(parseExpenseAmount(formatExpenseAmount(cents))).toBe(cents)
  })
})
