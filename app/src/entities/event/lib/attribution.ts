import type { AttendanceEntry } from '@shared/api/events'

/**
 * The name to show after "set by" on an attendee row, or `null` when no attribution should show.
 *
 * Silent in the normal case (⑪): a member who set their own answer, or one who never answered, gets
 * nothing. Only a row last changed by *someone else* (ADR-0003 trust-based editing) names them —
 * resolved from the event's own attendance list, since it carries every team member. A setter who
 * has since left the team falls back to a neutral label rather than an id.
 */
export function attributionName(attendance: AttendanceEntry, all: AttendanceEntry[]): string | null {
  const { changedBy } = attendance
  if (changedBy == null || changedBy === attendance.userId) return null
  return all.find((a) => a.userId === changedBy)?.displayName ?? 'a teammate'
}

/**
 * The same question asked about *the viewer's own* row, for the events-list card — which carries
 * every member's entry since ADR-0030 §8, so it can answer this without a detail fetch.
 *
 * `settling` is the viewer's own attendance write still in flight. It has to silence the whole
 * thing: the card's `myState` already shows the optimistic pick while `attendances` still holds the
 * row a teammate set, so for as long as those disagree, naming the teammate would credit them with
 * the answer the viewer just gave. Once the refreshed list lands, `changedBy` is the viewer and this
 * falls silent on its own.
 */
export function myAttributionName(
  attendances: AttendanceEntry[],
  currentUserId: string | null | undefined,
  settling: boolean,
): string | null {
  if (settling || !currentUserId) return null
  const mine = attendances.find((a) => a.userId === currentUserId)
  return mine ? attributionName(mine, attendances) : null
}
