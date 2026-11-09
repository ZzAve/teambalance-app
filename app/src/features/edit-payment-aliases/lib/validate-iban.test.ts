import { describe, expect, it } from 'vitest'
import { checkIban, groupIban, normaliseIban } from './validate-iban'

describe('normaliseIban', () => {
  it('drops spaces and upper-cases', () => {
    expect(normaliseIban(' nl91 abna 0417 1643 00 ')).toBe('NL91ABNA0417164300')
  })
})

describe('groupIban', () => {
  it('groups by four', () => {
    expect(groupIban('nl91abna0417164300')).toBe('NL91 ABNA 0417 1643 00')
  })
})

describe('checkIban', () => {
  it('is empty for blank input', () => expect(checkIban('  ')).toEqual({ state: 'empty' }))
  it('accepts a valid Dutch IBAN, spaced or not', () => {
    expect(checkIban('NL91 ABNA 0417 1643 00')).toEqual({ state: 'valid' })
    expect(checkIban('nl91abna0417164300')).toEqual({ state: 'valid' })
  })
  it('accepts a valid foreign IBAN', () => expect(checkIban('DE89 3704 0044 0532 0130 00')).toEqual({ state: 'valid' }))
  it('rejects a bad check digit', () =>
    expect(checkIban('NL92ABNA0417164300')).toEqual({ state: 'error', reason: 'checksum' }))
  it('rejects input that does not start with two letters and two digits', () => {
    expect(checkIban('1234ABNA0417164300')).toEqual({ state: 'error', reason: 'format' })
    expect(checkIban('NLX1ABNA')).toEqual({ state: 'error', reason: 'format' })
  })
  it('is still typing while the input is a prefix of two letters and two digits', () => {
    for (const prefix of ['N', 'NL', 'NL9']) expect(checkIban(prefix)).toEqual({ state: 'typing' })
  })
  it('shows the format error at once for a start that is no IBAN prefix', () => {
    for (const input of ['1', 'N1', 'NLA']) expect(checkIban(input)).toEqual({ state: 'error', reason: 'format' })
  })
  it.each([
    ['ES', 'ES91 2100 0418 4502 0005 1332', 'ES91 2100 0418', 12],
    ['IT', 'IT60 X054 2811 1010 0000 0123 456', 'IT60 X054 2811', 15],
    ['AT', 'AT61 1904 3002 3457 3201', 'AT61 1904 3002', 8],
  ])('knows the %s length: valid when complete, counts the rest while incomplete', (_c, full, part, remaining) => {
    expect(checkIban(full)).toEqual({ state: 'valid' })
    expect(checkIban(part)).toEqual({ state: 'typing', remaining })
  })
  it('counts the characters to go for Belgian and German IBANs, with no checksum error before full length', () => {
    expect(checkIban('BE68 5390 0754')).toEqual({ state: 'typing', remaining: 4 })
    expect(checkIban('DE89 3704 0044 0532')).toEqual({ state: 'typing', remaining: 6 })
    expect(checkIban('BE68 5390 0754 7034')).toEqual({ state: 'valid' })
    expect(checkIban('BE68 5390 0754 70341')).toEqual({ state: 'error', reason: 'tooLong' })
  })
  it('counts the characters to go for a Dutch IBAN still being typed', () => {
    expect(checkIban('NL91 ABNA 0417')).toEqual({ state: 'typing', remaining: 6 })
  })
  it('rejects a Dutch IBAN that is too long', () =>
    expect(checkIban('NL91ABNA04171643001')).toEqual({ state: 'error', reason: 'tooLong' }))
  it('is typing for a short IBAN of a country without a known length', () => expect(checkIban('SE45 5000')).toEqual({ state: 'typing' }))
})
