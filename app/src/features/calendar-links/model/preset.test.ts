import { describe, expect, it } from 'vitest'
import { PRESET_OPTIONS, presetOf, type LinkOptions } from './preset'

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
