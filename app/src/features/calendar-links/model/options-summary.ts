import { ALL_ATTENDANCE_STATES, STATE_LABELS, type LinkOptions } from './preset'

/**
 * One line describing how a link's options differ from the Me defaults, e.g. "Going only · no
 * ✓/✗ marks · calendar: Setpoint VT · Partner". Undefined for a link at the Me defaults.
 */
export function optionsSummary(options: LinkOptions, teamName: string): string | undefined {
  const allStates = ALL_ATTENDANCE_STATES.every((state) => options.attendanceStates.includes(state))
  const parts = [
    !allStates &&
      `${ALL_ATTENDANCE_STATES.filter((state) => options.attendanceStates.includes(state))
        .map((state) => STATE_LABELS[state])
        .join(', ')} only`,
    !options.showAttendancePrefix && 'no ✓/✗ marks',
    options.calendarNameSuffix && `calendar: ${teamName} · ${options.calendarNameSuffix}`,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : undefined
}
