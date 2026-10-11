import { describe, expect, it } from 'vitest'
import type { CalendarLink } from '@shared/api/calendar-links'
import { PRESET_OPTIONS, optionsOf, presetOf, type LinkOptions } from './preset'

const options = (overrides: Partial<LinkOptions> = {}): LinkOptions => ({
  attendanceStates: ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'],
  showAttendancePrefix: true,
  calendarNameSuffix: undefined,
  eventTypeIds: undefined,
  ...overrides,
})

describe('presetOf', () => {
  it('is Me for every state with the prefix on, in any order', () => {
    expect(presetOf(options({ attendanceStates: ['NOT_RESPONDED', 'ABSENT', 'MAYBE', 'ATTENDING'] }))).toBe('me')
  })

  it('is Partner for attending only with the prefix off', () => {
    expect(
      presetOf(options({ attendanceStates: ['ATTENDING'], showAttendancePrefix: false, calendarNameSuffix: 'Partner' })),
    ).toBe('partner')
  })

  it('is still Partner when the suffix differs, because the suffix takes no part', () => {
    expect(
      presetOf(options({ attendanceStates: ['ATTENDING'], showAttendancePrefix: false, calendarNameSuffix: 'Sanne' })),
    ).toBe('partner')
  })

  it('is Custom for anything else', () => {
    expect(presetOf(options({ showAttendancePrefix: false }))).toBe('custom')
    expect(presetOf(options({ attendanceStates: ['ATTENDING'] }))).toBe('custom')
    expect(presetOf(options({ attendanceStates: ['ATTENDING', 'MAYBE'], showAttendancePrefix: false }))).toBe('custom')
  })

  // An explicit list of types is a choice neither preset makes: both serve every type (ADR-0040).
  it('is Custom for an explicit list of event types, whatever the states and prefix', () => {
    expect(presetOf(options({ eventTypeIds: ['training'] }))).toBe('custom')
    expect(
      presetOf(options({ attendanceStates: ['ATTENDING'], showAttendancePrefix: false, eventTypeIds: ['training'] })),
    ).toBe('custom')
  })

  it('reads its own presets back', () => {
    expect(presetOf(PRESET_OPTIONS.me)).toBe('me')
    expect(presetOf(PRESET_OPTIONS.partner)).toBe('partner')
  })
})

describe('PRESET_OPTIONS', () => {
  it('Partner names its calendar "Partner"', () => {
    expect(PRESET_OPTIONS.partner).toEqual({
      attendanceStates: ['ATTENDING'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Partner',
      eventTypeIds: undefined,
    })
  })
})

describe('optionsOf', () => {
  // The API sends an absent option as null, which the generated type calls undefined.
  const fromServer = (overrides: Record<string, unknown>) =>
    ({
      id: 'l1',
      label: null,
      createdAt: '2026-09-01T10:00:00Z',
      expiresAt: '2027-09-01T10:00:00Z',
      expired: false,
      url: null,
      attendanceStates: ['ATTENDING'],
      showAttendancePrefix: false,
      calendarNameSuffix: null,
      eventTypeIds: null,
      ...overrides,
    }) as unknown as CalendarLink

  it('reads a null type list as every type, so a Partner link off the wire is still Partner', () => {
    const options = optionsOf(fromServer({ calendarNameSuffix: 'Partner' }))

    expect(options.eventTypeIds).toBeUndefined()
    expect(presetOf(options)).toBe('partner')
  })

  it('reads a null suffix as none, and a Me link off the wire as Me', () => {
    const options = optionsOf(
      fromServer({ attendanceStates: ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'], showAttendancePrefix: true }),
    )

    expect(options.calendarNameSuffix).toBeUndefined()
    expect(presetOf(options)).toBe('me')
  })
})
