import { describe, expect, it } from 'vitest'
import { optionsSummary } from './options-summary'
import { PRESET_OPTIONS } from './preset'

describe('optionsSummary', () => {
  it('is nothing for a link at the Me defaults, so those rows look as they always did', () => {
    expect(optionsSummary(PRESET_OPTIONS.me, 'Setpoint VT')).toBeUndefined()
  })

  it('spells out a Partner link', () => {
    expect(optionsSummary(PRESET_OPTIONS.partner, 'Setpoint VT')).toBe(
      'Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner',
    )
  })

  it('names each state a narrower link includes, in answer order', () => {
    expect(
      optionsSummary(
        { attendanceStates: ['NOT_RESPONDED', 'ATTENDING'], showAttendancePrefix: true, calendarNameSuffix: undefined },
        'Setpoint VT',
      ),
    ).toBe('Going, Not responded only')
  })

  it('mentions only the suffix when that is all that differs', () => {
    expect(optionsSummary({ ...PRESET_OPTIONS.me, calendarNameSuffix: 'Work' }, 'Setpoint VT')).toBe(
      'calendar: Setpoint VT · Work',
    )
  })
})
