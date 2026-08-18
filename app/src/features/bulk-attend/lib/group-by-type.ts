import type { Event } from '@shared/api/events'

/** The fillable events of one event type, ready for a button of its own. */
export interface EligibleTypeGroup {
  typeId: string
  typeName: string
  events: Event[]
}

/**
 * Splits already-eligible events into one bucket per event type (ADR-0021).
 *
 * Bulk Attend is offered per type rather than as a single action over everything shown: a standing
 * commitment is "I'm at every training", not "I'm at everything on this page", and a lone button
 * spanning types made the member narrow the Event Type filter first just to express that. One
 * button per type states its own scope and needs no filtering to be safe.
 *
 * Types are admin-configurable per team, so nothing here can privilege a particular name — the
 * groups are whatever types the team actually uses and currently has blanks in.
 *
 * Ordered by size, then name: the biggest commitment is the one most worth a single tap, and the
 * name tie-break keeps the row from reshuffling between two equally-sized types.
 *
 * Eligibility itself is decided upstream by [eligibleEvents], so this stays a pure regrouping of
 * whatever the page decided to show.
 */
export function groupByType(events: Event[]): EligibleTypeGroup[] {
  const byType = new Map<string, EligibleTypeGroup>()

  for (const event of events) {
    const group = byType.get(event.eventType.id)
    if (group) group.events.push(event)
    else byType.set(event.eventType.id, {
      typeId: event.eventType.id,
      typeName: event.eventType.name,
      events: [event],
    })
  }

  return [...byType.values()].sort(
    (a, b) => b.events.length - a.events.length || a.typeName.localeCompare(b.typeName),
  )
}
