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
    options.eventTypeIds &&
      eventTypes
        .filter((type) => options.eventTypeIds?.includes(type.id))
        .map((type) => (type.archived ? `${type.name} (archived)` : type.name))
        .join(', '),
    !allStates &&
      `${ALL_ATTENDANCE_STATES.filter((state) => options.attendanceStates.includes(state))
        .map((state) => ATTENDANCE_STATE_LABELS[state])
        .join(', ')} only`,
    !options.showAttendancePrefix && 'no ✓/✗ marks',
    options.calendarNameSuffix && `calendar: ${teamName} · ${options.calendarNameSuffix}`,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : undefined
}
