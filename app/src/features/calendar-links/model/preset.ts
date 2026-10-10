import type { AttendanceState } from '@shared/api/calendar-links'

/** The three shapes the create form offers (ADR-0040). Frontend defaults only; the server stores options. */
export type Preset = 'me' | 'partner' | 'custom'

export interface LinkOptions {
  attendanceStates: AttendanceState[]
  showAttendancePrefix: boolean
  calendarNameSuffix: string | undefined
}

export const ALL_ATTENDANCE_STATES: AttendanceState[] = ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED']

export const STATE_LABELS: Record<AttendanceState, string> = {
  ATTENDING: 'Attending',
  MAYBE: 'Maybe',
  ABSENT: 'Absent',
  NOT_RESPONDED: 'Not responded',
}

export const PRESET_OPTIONS: Record<Exclude<Preset, 'custom'>, LinkOptions> = {
  // Everything the team schedules, with the member's own answer marked.
  me: { attendanceStates: ALL_ATTENDANCE_STATES, showAttendancePrefix: true, calendarNameSuffix: undefined },
  // Only what the member is going to, unmarked, under a calendar name that says whose view it is.
  partner: { attendanceStates: ['ATTENDING'], showAttendancePrefix: false, calendarNameSuffix: 'Partner' },
}

/**
 * Which preset a set of options matches. Only the states and the prefix decide it: a Partner link
 * renamed "Sanne" is still a Partner link.
 */
export function presetOf({ attendanceStates, showAttendancePrefix }: LinkOptions): Preset {
  const states = new Set(attendanceStates)
  if (showAttendancePrefix && ALL_ATTENDANCE_STATES.every((state) => states.has(state))) return 'me'
  if (!showAttendancePrefix && states.size === 1 && states.has('ATTENDING')) return 'partner'
  return 'custom'
}
