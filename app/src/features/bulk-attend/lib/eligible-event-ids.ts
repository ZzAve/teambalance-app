import type { Event } from '@shared/api/events'

/**
 * The ids Bulk Attend would fill: the events currently *shown* that the member has not answered and
 * that have not started yet (ADR-0020).
 *
 * "Currently shown" is a client notion — the Event Type filter pills are the subset selector — so it
 * is resolved here rather than re-derived server-side. The same three conditions are enforced again
 * by the server; this selector exists so the button can show an honest count before the tap, and so
 * the ids it sends are the ones the user can actually see.
 *
 * `activeTypeIds` is the set of type pills currently on. An empty set means nothing is shown, which
 * is not the same as "no filter" — the caller passes the full set when every pill is on.
 */
export function eligibleEventIds(
  events: Event[] | undefined,
  activeTypeIds: Set<string>,
  now: Date,
): string[] {
  if (!events) return []
  return events
    .filter(
      (event) =>
        activeTypeIds.has(event.eventType.id) &&
        event.myState === 'NOT_RESPONDED' &&
        // `>=` matches the server's guard; an event that started a moment ago is not fillable.
        new Date(event.startTime) >= now,
    )
    .map((event) => event.id)
}
