import { describe, expect, it } from 'vitest'
import type { EventTypeItem } from '@shared/api/event-types'
import { optionsSummary } from './options-summary'
import { PRESET_OPTIONS } from './preset'

const type = (id: string, name: string, archived = false): EventTypeItem => ({
  id,
  name,
  color: undefined,
  archived,
  rosterDefault: { trackRoster: false, totalTarget: undefined, positionTargets: [] },
})

const TYPES = [type('t', 'Training'), type('m', 'Match'), type('b', 'Beach', true)]

describe('optionsSummary', () => {
  it('is nothing for a link at the Me defaults, so those rows look as they always did', () => {
    expect(optionsSummary(PRESET_OPTIONS.me, 'Setpoint VT', TYPES)).toBeUndefined()
  })

  it('spells out a Partner link', () => {
    expect(optionsSummary(PRESET_OPTIONS.partner, 'Setpoint VT', TYPES)).toBe(
      'Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner',
    )
  })

  it('names each state a narrower link includes, in answer order', () => {
    expect(
      optionsSummary(
        { ...PRESET_OPTIONS.me, attendanceStates: ['NOT_RESPONDED', 'ATTENDING'] },
        'Setpoint VT',
        TYPES,
      ),
    ).toBe('Going, Not responded only')
  })

  it('mentions only the suffix when that is all that differs', () => {
    expect(optionsSummary({ ...PRESET_OPTIONS.me, calendarNameSuffix: 'Work' }, 'Setpoint VT', TYPES)).toBe(
      'calendar: Setpoint VT · Work',
    )
  })

  it("names an explicit list's types in the team's order, an archived one marked as such", () => {
    expect(
      optionsSummary({ ...PRESET_OPTIONS.partner, eventTypeIds: ['b', 't'] }, 'Setpoint VT', TYPES),
    ).toBe('Training, Beach (archived) · Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner')
  })
})
