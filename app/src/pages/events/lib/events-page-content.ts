import type { Event } from '@shared/api/events'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { hasTurnoutTargets, type TurnoutBucket } from '@features/filter-event-types/model/turnout'
import { emptyEventsMessage } from '@features/filter-event-types/model/empty-message'
import { eligibleEvents } from '@features/bulk-attend/lib/eligible-event-ids'

export interface EventsPageInput {
  /** The loaded events, in whatever order the API sent them. */
  events: Event[] | undefined
  /** Every event type that exists; undefined until they load, which withholds filtering. */
  allTypeIds: string[] | undefined
  activeTypeIds: Set<string>
  activeStates: Set<AttendanceState>
  activeTurnouts: Set<TurnoutBucket>
  showPast: boolean
  now: Date
  isLoading: boolean
  error: unknown
}

export interface EventsPageContent {
  /** The Next Up hero's event, when one is due. */
  heroEvent: Event | null
  /** The filtered events in chronological order, without the hero's event. */
  listEvents: Event[]
  /** What the Bulk Attend buttons cover: the list's unanswered, future events. */
  bulkAttendEvents: Event[]
  showTurnout: boolean
  /** The events that passed the filter, the hero's included. */
  resultCount: number
  emptyMessage: string
  isLoading: boolean
  error: unknown
}

/**
 * What the events page shows. Everything on the page follows the filter — hero, list and Bulk Attend
 * alike (ADR-0029 §6) — so they are all derived here from the one filtered list, in the order that
 * makes that true: filter, sort, pick the hero, drop it from the list, then read Bulk Attend off the
 * list that remains (#386).
 */
export function eventsPageContent({
  events,
  allTypeIds,
  activeTypeIds,
  activeStates,
  activeTurnouts,
  showPast,
  now,
  isLoading,
  error,
}: EventsPageInput): EventsPageContent {
  const loaded = events ?? []
  const filtered = allTypeIds ? filterEvents(loaded, activeTypeIds, activeStates, activeTurnouts) : loaded
  // The API returns upcoming ascending but "all" descending, and the list is flat, so sort here.
  const sorted = [...filtered].sort((a, b) => a.startTime.localeCompare(b.startTime))

  const heroEvent = showPast ? null : selectHeroEvent(sorted, now)
  const listEvents = heroEvent ? sorted.filter((e) => e.id !== heroEvent.id) : sorted

  return {
    heroEvent,
    listEvents,
    bulkAttendEvents: eligibleEvents(listEvents, activeTypeIds, now),
    // Read off the unfiltered list (ADR-0029 §5): narrowing another dimension must not make the
    // group vanish underneath a Turnout selection that is still in effect.
    showTurnout: hasTurnoutTargets(loaded),
    resultCount: sorted.length,
    emptyMessage: emptyEventsMessage({
      hasHero: heroEvent !== null,
      showPast,
      activeTypeIds,
      allTypeIds: allTypeIds ?? [],
      activeStates,
      activeTurnouts,
    }),
    // A rendered hero IS loaded data — it was pulled out of this very list — so an empty list beneath
    // it means "nothing else", never a failure.
    isLoading: heroEvent ? false : isLoading,
    error: heroEvent ? undefined : error,
  }
}
