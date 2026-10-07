import type { AttendanceEntry } from '@shared/api/events'

export type AttendanceState = AttendanceEntry['state']

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

/**
 * The given user's answer among an event's attendances. A user with no entry has not responded:
 * `NOT_RESPONDED` is the absence of a row (ADR-0009/0020).
 */
export function myAnswerOf(
  attendances: readonly Pick<AttendanceEntry, 'userId' | 'state'>[],
  userId: string | null,
): AttendanceState {
  return attendances.find((a) => a.userId === userId)?.state ?? 'NOT_RESPONDED'
}
