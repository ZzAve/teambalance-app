import { ALL_ATTENDANCE_STATES, ATTENDANCE_STATE_LABELS } from '@entities/event/lib/attendance-states'
import type { EventTypeItem } from '@shared/api/event-types'
import type { LinkOptions } from './preset'

/**
 * One line describing how a link's options differ from the Me defaults, e.g. "Training, Match ·
 * Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner". Undefined for a link at the Me
 * defaults. Types are named in the team's order, an archived one as "Beach (archived)".
 */
export function optionsSummary(options: LinkOptions, teamName: string, eventTypes: EventTypeItem[]): string | undefined {
  const allStates = ALL_ATTENDANCE_STATES.every((state) => options.attendanceStates.includes(state))
  const parts = [
    options.eventTypeIds && typesPart(options.eventTypeIds, eventTypes),
    !allStates &&
      `${ALL_ATTENDANCE_STATES.filter((state) => options.attendanceStates.includes(state))
        .map((state) => ATTENDANCE_STATE_LABELS[state])
        .join(', ')} only`,
    !options.showAttendancePrefix && 'no ✓/✗ marks',
    options.calendarNameSuffix && `calendar: ${teamName} · ${options.calendarNameSuffix}`,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : undefined
}

/**
 * The named types, then a count of any whose names are not known (the types still loading, or their
 * request failed), so a link limited to some types never reads as one serving all of them.
 */
function typesPart(ids: string[], eventTypes: EventTypeItem[]): string {
  const named = eventTypes
    .filter((type) => ids.includes(type.id))
    .map((type) => (type.archived ? `${type.name} (archived)` : type.name))
  const unknown = ids.length - named.length
  if (unknown === 0) return named.join(', ')
  const count = `${unknown} ${named.length > 0 ? 'other ' : ''}event type${unknown === 1 ? '' : 's'}`
  return [...named, count].join(', ')
}
