import { describe, expect, it } from 'vitest'
import {
  RELATIVE_WINDOW_DAYS,
  calendarDaysUntil,
  relativeEventLabel,
} from './relative-event-label'

// All dates are built with the local-time Date constructor and handed to the function as ISO
// strings, so these tests assert the same behaviour in any runner timezone: the function reads
// calendar days in the viewer's local zone, which is exactly what "Today"/"Tomorrow" mean to a user.
const at = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0)
const iso = (d: Date) => d.toISOString()

const label = (start: Date, now: Date) => relativeEventLabel(iso(start), now)

// 2026-08-10 is a Monday; the week runs Mon 10 → Sun 16, so Sat 15 / Sun 16 are "this weekend".
const MON = at(2026, 8, 10)
const TUE = at(2026, 8, 11)
const THU = at(2026, 8, 13)
const FRI = at(2026, 8, 14)
const SAT = at(2026, 8, 15)
const SUN = at(2026, 8, 16)

describe('RELATIVE_WINDOW_DAYS', () => {
  it('ships at 7', () => {
    expect(RELATIVE_WINDOW_DAYS).toBe(7)
  })
})

describe('calendarDaysUntil', () => {
  it('counts midnight boundaries crossed, not 24-hour blocks', () => {
    // 30 minutes apart, but across midnight — one calendar day.
    expect(calendarDaysUntil(iso(at(2026, 8, 11, 0, 15)), at(2026, 8, 10, 23, 45))).toBe(1)
    // 23 hours apart, same calendar day — zero.
    expect(calendarDaysUntil(iso(at(2026, 8, 10, 23, 30)), at(2026, 8, 10, 0, 30))).toBe(0)
  })

  it('is negative for past days', () => {
    expect(calendarDaysUntil(iso(at(2026, 8, 9)), MON)).toBe(-1)
  })

  it('crosses month and year boundaries', () => {
    expect(calendarDaysUntil(iso(at(2026, 9, 2)), at(2026, 8, 30))).toBe(3)
    expect(calendarDaysUntil(iso(at(2027, 1, 2)), at(2026, 12, 30))).toBe(3)
  })

  it('accepts a Date as well as an ISO string', () => {
    expect(calendarDaysUntil(at(2026, 8, 12), MON)).toBe(2)
  })
})

describe('relativeEventLabel', () => {
  describe('same calendar day → Today (solid)', () => {
    it('labels an event later today', () => {
      expect(label(at(2026, 8, 10, 20, 0), at(2026, 8, 10, 9, 0))).toEqual({
        text: 'Today',
        emphasis: 'solid',
      })
    })

    it('still labels an event that already started today', () => {
      expect(label(at(2026, 8, 10, 9, 0), at(2026, 8, 10, 20, 0))).toEqual({
        text: 'Today',
        emphasis: 'solid',
      })
    })

    it('says Today — not Tomorrow — for a late-evening event seen in the morning', () => {
      expect(label(at(2026, 8, 10, 23, 30), at(2026, 8, 10, 0, 30))?.text).toBe('Today')
    })
  })

  describe('next calendar day → Tomorrow (solid)', () => {
    it('labels an event just after midnight tonight', () => {
      // Only 45 minutes away, but it is tomorrow to a human reading a calendar.
      expect(label(at(2026, 8, 11, 0, 15), at(2026, 8, 10, 23, 30))).toEqual({
        text: 'Tomorrow',
        emphasis: 'solid',
      })
    })

    it('labels an event 30 hours out — calendar days, not 24-hour blocks', () => {
      expect(label(at(2026, 8, 11, 18, 0), at(2026, 8, 10, 12, 0))).toEqual({
        text: 'Tomorrow',
        emphasis: 'solid',
      })
    })
  })

  describe('the coming Sat/Sun → This weekend', () => {
    it('is quiet when the weekend is more than 2 days out', () => {
      expect(label(SAT, TUE)).toEqual({ text: 'This weekend', emphasis: 'quiet' })
      expect(label(SUN, TUE)).toEqual({ text: 'This weekend', emphasis: 'quiet' })
    })

    it('is solid when the weekend is 2 days out', () => {
      expect(label(SAT, THU)).toEqual({ text: 'This weekend', emphasis: 'solid' })
      expect(label(SUN, FRI)).toEqual({ text: 'This weekend', emphasis: 'solid' })
    })

    it('loses to Today and Tomorrow, which are more precise', () => {
      expect(label(SAT, FRI)?.text).toBe('Tomorrow')
      expect(label(SAT, SAT)?.text).toBe('Today')
      expect(label(SUN, SAT)?.text).toBe('Tomorrow')
    })

    it('does not call NEXT weekend "this weekend"', () => {
      // Seen on Sunday, the Saturday six days out belongs to the following week.
      expect(label(at(2026, 8, 22), SUN)).toEqual({ text: 'in 6 days', emphasis: 'quiet' })
    })
  })

  describe('within the window → in N days', () => {
    it('is solid at 2 days', () => {
      expect(label(at(2026, 8, 12), MON)).toEqual({ text: 'in 2 days', emphasis: 'solid' })
    })

    it('is quiet from 3 days to the edge of the window', () => {
      expect(label(at(2026, 8, 13), MON)).toEqual({ text: 'in 3 days', emphasis: 'quiet' })
      expect(label(at(2026, 8, 17), MON)).toEqual({ text: 'in 7 days', emphasis: 'quiet' })
    })
  })

  describe('outside the window → no label', () => {
    it('drops the label one day past the window', () => {
      expect(label(at(2026, 8, 18), MON)).toBeNull()
    })

    it('drops the label for past events', () => {
      expect(label(at(2026, 8, 9), MON)).toBeNull()
      expect(label(at(2026, 7, 1), MON)).toBeNull()
    })
  })
})
