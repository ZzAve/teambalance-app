import { describe, expect, it } from 'vitest'
import { bunqMeLinkError, centsToEuroText, euroTextToCents, settingsChanged } from './money-settings'

describe('euroTextToCents', () => {
  it('reads a comma or a dot as the decimal separator', () => {
    expect(euroTextToCents('2,70')).toBe(270)
    expect(euroTextToCents('2.70')).toBe(270)
  })

  it('reads whole euros and one decimal', () => {
    expect(euroTextToCents('3')).toBe(300)
    expect(euroTextToCents('2,5')).toBe(250)
  })

  it('ignores surrounding whitespace', () => {
    expect(euroTextToCents(' 2,70 ')).toBe(270)
  })

  it('accepts the 1 cent and 100 euro limits', () => {
    expect(euroTextToCents('0,01')).toBe(1)
    expect(euroTextToCents('100')).toBe(10_000)
  })

  it('is undefined for blank input, meaning no price', () => {
    expect(euroTextToCents('')).toBeUndefined()
    expect(euroTextToCents('  ')).toBeUndefined()
  })

  it('is NaN for input that is not a valid price', () => {
    for (const text of ['abc', '0', '0,00', '-1', '100,01', '2,555', '1,2,3', '€2']) {
      expect(euroTextToCents(text), text).toBeNaN()
    }
  })
})

describe('centsToEuroText', () => {
  it('formats with a decimal comma and two decimals', () => {
    expect(centsToEuroText(270)).toBe('2,70')
    expect(centsToEuroText(300)).toBe('3,00')
  })

  it('is empty without a price', () => {
    expect(centsToEuroText(undefined)).toBe('')
  })
})

describe('bunqMeLinkError', () => {
  it('accepts a bunq.me link with or without scheme, and blank', () => {
    expect(bunqMeLinkError('https://bunq.me/setpointvt')).toBeNull()
    expect(bunqMeLinkError('bunq.me/setpointvt/')).toBeNull()
    expect(bunqMeLinkError('')).toBeNull()
  })

  it('rejects other hosts, nested paths and queries', () => {
    for (const link of ['https://evil.example/x', 'https://bunq.me.evil.example/x', 'https://bunq.me/a/b', 'https://bunq.me/a?b=1', 'https://bunq.me']) {
      expect(bunqMeLinkError(link), link).not.toBeNull()
    }
  })
})

describe('settingsChanged', () => {
  const saved = { enabled: true, beerPrice: 270, bunqMeLink: 'https://bunq.me/setpointvt' }

  it('is false for an identical draft', () => {
    expect(settingsChanged(saved, { ...saved })).toBe(false)
  })

  it('treats a link typed without scheme or with a trailing slash as unchanged', () => {
    expect(settingsChanged(saved, { ...saved, bunqMeLink: 'bunq.me/setpointvt/' })).toBe(false)
  })

  it('is true when any field differs', () => {
    expect(settingsChanged(saved, { ...saved, enabled: false })).toBe(true)
    expect(settingsChanged(saved, { ...saved, beerPrice: 300 })).toBe(true)
    expect(settingsChanged(saved, { ...saved, bunqMeLink: undefined })).toBe(true)
  })
})
