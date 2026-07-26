import { describe, expect, it } from 'vitest'
import { isSeasonConfigured, seasonChanged, validateSeasonRange } from './season'

describe('validateSeasonRange', () => {
  it('accepts an in-order range', () => {
    expect(validateSeasonRange({ start: '2026-09-01', end: '2027-04-30' })).toBeNull()
  })

  it('accepts equal start and end', () => {
    expect(validateSeasonRange({ start: '2026-09-01', end: '2026-09-01' })).toBeNull()
  })

  it('rejects an inverted range', () => {
    expect(validateSeasonRange({ start: '2027-04-30', end: '2026-09-01' })).toBe(
      'End date must be on or after the start date.',
    )
  })

  it('accepts a half-open range (only one bound set)', () => {
    expect(validateSeasonRange({ start: '2026-09-01' })).toBeNull()
    expect(validateSeasonRange({ end: '2027-04-30' })).toBeNull()
  })

  it('accepts an empty season', () => {
    expect(validateSeasonRange({})).toBeNull()
    expect(validateSeasonRange({ start: '', end: '' })).toBeNull()
  })
})

describe('isSeasonConfigured', () => {
  it('is false when both bounds are empty or absent', () => {
    expect(isSeasonConfigured({})).toBe(false)
    expect(isSeasonConfigured({ start: '', end: '' })).toBe(false)
  })

  it('is true when either bound is set', () => {
    expect(isSeasonConfigured({ start: '2026-09-01' })).toBe(true)
    expect(isSeasonConfigured({ end: '2027-04-30' })).toBe(true)
  })
})

describe('seasonChanged', () => {
  it('detects a changed bound', () => {
    expect(seasonChanged({ start: '2026-09-01' }, { start: '2026-10-01' })).toBe(true)
  })

  it('treats empty string and undefined as equal (not a change)', () => {
    expect(seasonChanged({ start: undefined, end: undefined }, { start: '', end: '' })).toBe(false)
  })

  it('is false for identical bounds', () => {
    expect(seasonChanged({ start: '2026-09-01', end: '2027-04-30' }, { start: '2026-09-01', end: '2027-04-30' })).toBe(
      false,
    )
  })
})
