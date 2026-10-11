import { describe, expect, it } from 'vitest'
import { parseTopUpAmount } from './amount'

describe('parseTopUpAmount', () => {
  it('accepts whole euros from 1 to 500', () => {
    expect(parseTopUpAmount('1')).toBe(1)
    expect(parseTopUpAmount('75')).toBe(75)
    expect(parseTopUpAmount('500')).toBe(500)
  })

  it('ignores surrounding whitespace', () => {
    expect(parseTopUpAmount(' 20 ')).toBe(20)
  })

  it('rejects zero and anything above 500', () => {
    expect(parseTopUpAmount('0')).toBeNull()
    expect(parseTopUpAmount('501')).toBeNull()
  })

  it('rejects decimals, signs, text and an empty field', () => {
    for (const input of ['12.5', '12,5', '-5', '+5', '1e2', 'abc', '', '  ']) {
      expect(parseTopUpAmount(input), input).toBeNull()
    }
  })
})
