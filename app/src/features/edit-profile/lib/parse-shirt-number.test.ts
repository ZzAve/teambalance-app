import { describe, expect, it } from 'vitest'
import { parseShirtNumber } from './parse-shirt-number'

describe('parseShirtNumber', () => {
  it('reads an empty field as no number', () => {
    expect(parseShirtNumber('  ')).toEqual({ value: null, error: null })
  })

  it('accepts a whole number from 0 to 999', () => {
    expect(parseShirtNumber('0')).toEqual({ value: 0, error: null })
    expect(parseShirtNumber(' 112 ')).toEqual({ value: 112, error: null })
    expect(parseShirtNumber('999')).toEqual({ value: 999, error: null })
  })

  it('reads 07 as 7', () => {
    expect(parseShirtNumber('07')).toEqual({ value: 7, error: null })
  })

  it('rejects a number above 999', () => {
    expect(parseShirtNumber('1000').error).toMatch(/0 to 999/)
  })

  it('rejects anything that is not a whole number', () => {
    expect(parseShirtNumber('-1').error).toMatch(/0 to 999/)
    expect(parseShirtNumber('7.5').error).toMatch(/0 to 999/)
    expect(parseShirtNumber('seven').error).toMatch(/0 to 999/)
  })
})
