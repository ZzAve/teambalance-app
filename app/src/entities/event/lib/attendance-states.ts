import type { Event } from '@shared/api/events'

type AttendanceState = Event['myState']

/**
 * The four Attendance States, in the order the answer control offers them (#273).
 *
 * They are a *total partition* of the events list — every event carries exactly one `myState` — which
 * is what lets "all chips on" mean "no constraint" in the events filter (ADR-0029 §1). Anything added
 * here has to keep that true.
 */
export const ALL_ATTENDANCE_STATES: AttendanceState[] = ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED']
