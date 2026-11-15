import { describe, expect, it } from 'vitest'
import { dateFromShowUntil, hasEnded, showUntilFromDate } from './show-until'

describe('showUntilFromDate', () => {
  it('is the last second of the chosen local day', () => {
    const iso = showUntilFromDate('2026-11-23')!
    const local = new Date(iso)
    expect([local.getFullYear(), local.getMonth(), local.getDate(), local.getHours(), local.getMinutes()]).toEqual([2026, 10, 23, 23, 59])
  })

  it('is null for an empty or partial field', () => {
    expect(showUntilFromDate('')).toBeNull()
    expect(showUntilFromDate('2026-11')).toBeNull()
  })
})

describe('dateFromShowUntil', () => {
  it('gives back the day that was picked', () => {
    expect(dateFromShowUntil(showUntilFromDate('2026-11-23')!)).toBe('2026-11-23')
  })

  it('is empty without a show-until', () => {
    expect(dateFromShowUntil(undefined)).toBe('')
  })
})

describe('hasEnded', () => {
  const until = '2026-11-23T22:59:59.000Z'

  it('is false before the show-until and without one', () => {
    expect(hasEnded(until, new Date('2026-11-23T22:00:00Z'))).toBe(false)
    expect(hasEnded(undefined, new Date('2030-01-01T00:00:00Z'))).toBe(false)
    // The API sends null for "no show-until", although the generated type says undefined.
    expect(hasEnded(null, new Date('2030-01-01T00:00:00Z'))).toBe(false)
  })

  it('is true from the show-until on', () => {
    expect(hasEnded(until, new Date(until))).toBe(true)
  })
})
