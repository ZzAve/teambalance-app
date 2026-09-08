import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'

/**
 * The four Attendance States, in the order the answer control offers them (#273).
 *
 * They are a *total partition* of the list — every event carries exactly one `myState` — which is
 * what lets "all chips on" mean "no constraint" and never hide anything (ADR-0029 §1). Anything
 * added here has to keep that true.
 */
export const ALL_ATTENDANCE_STATES: AttendanceState[] = [
    'ATTENDING',
    'MAYBE',
    'ABSENT',
    'NOT_RESPONDED',
]
