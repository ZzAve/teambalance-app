import type { AttendanceEntry, AttendanceSummary, EventDetail } from './events'

type AttendanceState = AttendanceEntry['state']

/** Which summary counter each state feeds. `roleBreakdown` is left to the server reconciliation. */
const SUMMARY_FIELD: Record<AttendanceState, keyof Omit<AttendanceSummary, 'roleBreakdown'>> = {
  ATTENDING: 'attending',
  MAYBE: 'maybe',
  ABSENT: 'absent',
  NOT_RESPONDED: 'notResponded',
}

/**
 * Returns a copy of the cached event detail with the given user's attendance entry set to
 * `state` — the optimistic patch behind an instant-feeling attendance toggle.
 *
 * The summary counters move with the entry: the old state loses one, the new state gains one. Any
 * surface showing a response *and* a headcount together (the Next Up hero's "10 going · you're in")
 * would otherwise contradict itself for the round-trip between the tap and `onSettled`. Counters
 * never go below zero, so a summary that is already out of step with the entries cannot be driven
 * negative.
 *
 * Only an existing entry is patched: a first-time responder has no row in `attendances`, and the
 * mutation carries no `displayName`/`role` to synthesise a complete one, so an unknown user is a
 * no-op (the server reconciliation on `onSettled` fills that case in). The update is immutable —
 * the original event and its entries are never touched, so a rollback can restore the snapshot.
 */
export function applyOptimisticAttendance(
  event: EventDetail | undefined,
  userId: string,
  state: AttendanceState,
): EventDetail | undefined {
  if (!event) return event

  const previous = event.attendances.find((a) => a.userId === userId)
  if (!previous) return event

  const summary = { ...event.attendanceSummary }
  if (previous.state !== state) {
    const from = SUMMARY_FIELD[previous.state]
    const to = SUMMARY_FIELD[state]
    summary[from] = Math.max(0, summary[from] - 1)
    summary[to] = summary[to] + 1
  }

  return {
    ...event,
    attendanceSummary: summary,
    attendances: event.attendances.map((a) => (a.userId === userId ? { ...a, state } : a)),
  }
}
