import { describe, expect, it } from 'vitest'
import {
  buildCalendarPreview,
  defaultDateRange,
  generateOccurrences,
  MAX_OCCURRENCES,
  type RecurrenceInput,
} from './recurrence'

const rule = (overrides: Partial<RecurrenceInput> = {}): RecurrenceInput => ({
  frequency: 'WEEKLY',
  weekdays: ['TUESDAY'],
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  ...overrides,
})

describe('generateOccurrences', () => {
  it('weekly generates every in-range date matching a single weekday', () => {
    // Tuesdays in September 2026.
    expect(generateOccurrences(rule())).toEqual([
      '2026-09-01', '2026-09-08', '2026-09-15', '2026-09-22', '2026-09-29',
    ])
  })

  it('weekly interleaves multiple weekdays chronologically', () => {
    expect(
      generateOccurrences(rule({ weekdays: ['TUESDAY', 'THURSDAY'], startDate: '2026-09-07', endDate: '2026-09-20' })),
    ).toEqual(['2026-09-08', '2026-09-10', '2026-09-15', '2026-09-17'])
  })

  it('bi-weekly keeps every other occurrence PER weekday, not every other row', () => {
    // Tue: 08(keep) 15(skip) 22(keep) 29(skip); Thu: 10(keep) 17(skip) 24(keep) 10-01(skip).
    expect(
      generateOccurrences(
        rule({ frequency: 'BIWEEKLY', weekdays: ['TUESDAY', 'THURSDAY'], startDate: '2026-09-07', endDate: '2026-10-04' }),
      ),
    ).toEqual(['2026-09-08', '2026-09-10', '2026-09-22', '2026-09-24'])
  })

  it('bi-weekly on a single weekday keeps alternating weeks', () => {
    expect(generateOccurrences(rule({ frequency: 'BIWEEKLY' }))).toEqual([
      '2026-09-01', '2026-09-15', '2026-09-29',
    ])
  })

  it('treats both range boundaries as inclusive', () => {
    expect(generateOccurrences(rule({ startDate: '2026-09-01', endDate: '2026-09-08' }))).toEqual([
      '2026-09-01', '2026-09-08',
    ])
  })

  it('returns an empty list when no in-range date matches the selected weekday', () => {
    expect(generateOccurrences(rule({ weekdays: ['SUNDAY'], startDate: '2026-09-07', endDate: '2026-09-11' }))).toEqual([])
  })

  it('returns an empty list when no weekday is selected', () => {
    expect(generateOccurrences(rule({ weekdays: [] }))).toEqual([])
  })

  it('returns an empty list when the end date precedes the start date', () => {
    expect(generateOccurrences(rule({ startDate: '2026-09-30', endDate: '2026-09-01' }))).toEqual([])
  })

  it('generates the correct weekly dates across the autumn DST boundary (2026-10-25)', () => {
    // Europe/Amsterdam falls back on 2026-10-25. UTC iteration must keep exact 7-day calendar steps
    // — a naive local +24h step would drift and could skip or duplicate a Tuesday.
    expect(
      generateOccurrences(rule({ weekdays: ['TUESDAY'], startDate: '2026-10-06', endDate: '2026-11-03' })),
    ).toEqual(['2026-10-06', '2026-10-13', '2026-10-20', '2026-10-27', '2026-11-03'])
  })

  it('a full Sep→May Tue+Thu season stays within the 200 cap', () => {
    const count = generateOccurrences(rule({ weekdays: ['TUESDAY', 'THURSDAY'], startDate: '2026-09-01', endDate: '2027-05-31' })).length
    expect(count).toBeLessThanOrEqual(MAX_OCCURRENCES)
  })

  it('a two-year weekday-heavy range exceeds the 200 cap', () => {
    const count = generateOccurrences(
      rule({ weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], startDate: '2026-01-01', endDate: '2027-12-31' }),
    ).length
    expect(count).toBeGreaterThan(MAX_OCCURRENCES)
  })
})

describe('buildCalendarPreview', () => {
  const season = { start: '2026-09-01', end: '2027-05-31' }

  it('reports the running count and first/last dates', () => {
    const preview = buildCalendarPreview(rule({ startDate: '2026-09-01', endDate: '2026-09-30' }), season)
    expect(preview.count).toBe(5)
    expect(preview.firstDate).toBe('2026-09-01')
    expect(preview.lastDate).toBe('2026-09-29')
    expect(preview.overCap).toBe(false)
    expect(preview.outOfSeasonCount).toBe(0)
  })

  it('flags occurrences that fall outside the season window', () => {
    // Season ends 2026-09-05; dates past it are occurrences but out of season.
    const preview = buildCalendarPreview(
      rule({ weekdays: ['TUESDAY'], startDate: '2026-09-01', endDate: '2026-09-30' }),
      { start: '2026-09-01', end: '2026-09-05' },
    )
    expect(preview.outOfSeasonCount).toBe(4) // 09-08, 09-15, 09-22, 09-29
    const allCells = preview.months.flatMap((m) => m.weeks.flat())
    const sep08 = allCells.find((c) => c.date === '2026-09-08')
    expect(sep08?.isOccurrence).toBe(true)
    expect(sep08?.outOfSeason).toBe(true)
    const sep01 = allCells.find((c) => c.date === '2026-09-01')
    expect(sep01?.isOccurrence).toBe(true)
    expect(sep01?.outOfSeason).toBe(false)
  })

  it('does not truncate a normal in-season series', () => {
    const preview = buildCalendarPreview(rule({ startDate: '2026-09-01', endDate: '2026-10-31' }), season)
    expect(preview.truncated).toBe(false)
    expect(preview.months.length).toBeLessThanOrEqual(18)
  })

  it('truncates the rendered months for a long span but keeps the full count', () => {
    // ~2.5 years of weekly Mondays: ~130 events (under the cap) spanning 30 months.
    const preview = buildCalendarPreview(
      rule({ weekdays: ['MONDAY'], startDate: '2026-01-01', endDate: '2028-06-30' }),
      undefined,
    )
    expect(preview.count).toBeGreaterThan(100)
    expect(preview.count).toBeLessThanOrEqual(200)
    expect(preview.truncated).toBe(true)
    expect(preview.months.length).toBe(18)
  })

  it('does not let a far-future endDate with no occurrences beyond it inflate the grid', () => {
    // Weekly Tue Sept only, but endDate stretches to December — months stop at the last occurrence.
    const preview = buildCalendarPreview(
      rule({ weekdays: ['TUESDAY'], startDate: '2026-09-01', endDate: '2026-09-30' }),
      undefined,
    )
    expect(preview.truncated).toBe(false)
    expect(preview.months.length).toBe(1) // September only — no empty trailing months
  })

  it('signals over-cap when generation exceeds the maximum', () => {
    const preview = buildCalendarPreview(
      rule({ weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], startDate: '2026-01-01', endDate: '2027-12-31' }),
      undefined,
    )
    expect(preview.overCap).toBe(true)
  })

  it('lays out a month grid Monday-first with correct leading pads', () => {
    // September 2026 starts on a Tuesday → one leading pad cell (Monday) before day 1.
    const preview = buildCalendarPreview(rule({ startDate: '2026-09-01', endDate: '2026-09-30' }), season)
    const sept = preview.months.find((m) => m.month === 8 && m.year === 2026)!
    expect(sept.label).toBe('September 2026')
    expect(sept.weeks[0][0].date).toBeNull() // Monday pad
    expect(sept.weeks[0][1].date).toBe('2026-09-01') // Tuesday, day 1
  })

  it('marks days inside and outside the season band', () => {
    const preview = buildCalendarPreview(rule({ startDate: '2026-09-01', endDate: '2026-09-30' }), { start: '2026-09-10', end: '2026-09-20' })
    const cells = preview.months.flatMap((m) => m.weeks.flat()).filter((c) => c.date)
    expect(cells.find((c) => c.date === '2026-09-05')?.inSeason).toBe(false)
    expect(cells.find((c) => c.date === '2026-09-15')?.inSeason).toBe(true)
  })
})

describe('defaultDateRange', () => {
  it('starts at the season start when it is in the future', () => {
    expect(defaultDateRange({ start: '2026-09-01', end: '2027-05-31' }, '2026-07-26')).toEqual({
      startDate: '2026-09-01',
      endDate: '2027-05-31',
    })
  })

  it('starts at today when the season has already begun', () => {
    expect(defaultDateRange({ start: '2026-09-01', end: '2027-05-31' }, '2026-12-01')).toEqual({
      startDate: '2026-12-01',
      endDate: '2027-05-31',
    })
  })

  it('falls back to today with an open end when no season is configured', () => {
    expect(defaultDateRange(undefined, '2026-07-26')).toEqual({ startDate: '2026-07-26', endDate: '' })
  })
})
