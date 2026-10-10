import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import type { AttendanceState } from '@shared/api/calendar-links'

/** The three shapes the create form offers (ADR-0040). Frontend defaults only; the server stores options. */
export type Preset = 'me' | 'partner' | 'custom'

export interface LinkOptions {
  attendanceStates: AttendanceState[]
  showAttendancePrefix: boolean
  calendarNameSuffix: string | undefined
  /** Undefined is every type, including ones created later; a list is an explicit allowlist. */
  eventTypeIds: string[] | undefined
}

export const PRESET_OPTIONS: Record<Exclude<Preset, 'custom'>, LinkOptions> = {
  // Everything the team schedules, with the member's own answer marked.
  me: {
    attendanceStates: ALL_ATTENDANCE_STATES,
    showAttendancePrefix: true,
    calendarNameSuffix: undefined,
    eventTypeIds: undefined,
  },
  // Only what the member is going to, unmarked, under a calendar name that says whose view it is.
  partner: {
    attendanceStates: ['ATTENDING'],
    showAttendancePrefix: false,
    calendarNameSuffix: 'Partner',
    eventTypeIds: undefined,
  },
}

/**
 * Which preset a set of options matches. The states, the prefix and the event types decide it: a
 * Partner link renamed "Sanne" is still a Partner link, but one limited to some types is Custom,
 * since both presets serve every type.
 */
export function presetOf({ attendanceStates, showAttendancePrefix, eventTypeIds }: LinkOptions): Preset {
  if (eventTypeIds !== undefined) return 'custom'
  const states = new Set(attendanceStates)
  if (showAttendancePrefix && ALL_ATTENDANCE_STATES.every((state) => states.has(state))) return 'me'
  if (!showAttendancePrefix && states.size === 1 && states.has('ATTENDING')) return 'partner'
  return 'custom'
}
