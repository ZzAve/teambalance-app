import type { AttendanceEntry, EventDetail } from './events'

type AttendanceState = AttendanceEntry['state']

/**
 * Returns a copy of the cached event detail with the given user's attendance entry set to
 * `state` — the optimistic patch behind an instant-feeling attendance toggle.
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
  if (!event.attendances.some((a) => a.userId === userId)) return event

  return {
    ...event,
    attendances: event.attendances.map((a) => (a.userId === userId ? { ...a, state } : a)),
  }
}
