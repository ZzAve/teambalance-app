import type { AttendanceEntry } from '@shared/api/events'

/**
 * The name to show after "set by" on an attendee row, or `null` when no attribution should show —
 * which doubles as the marker-dot predicate (⑪): the dot shows exactly when this returns a name.
 *
 * Silent in the normal case: a member who set their own answer, or one who never answered, gets
 * nothing. NOT_RESPONDED is silent too — a blank is not an answer someone gave on your behalf, so a
 * teammate who cleared a row leaves no mark. Only a row last changed by *someone else* (ADR-0003
 * trust-based editing) names them — resolved from the event's own attendance list, since it carries
 * every team member. A setter who has since left the team falls back to a neutral label rather than
 * an id.
 */
export function attributionName(attendance: AttendanceEntry, all: AttendanceEntry[]): string | null {
  const { changedBy } = attendance
  if (changedBy == null || changedBy === attendance.userId || attendance.state === 'NOT_RESPONDED') return null
  return all.find((a) => a.userId === changedBy)?.displayName ?? 'a teammate'
}
