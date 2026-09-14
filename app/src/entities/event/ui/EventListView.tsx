import type { ReactNode } from 'react'
import type { Event } from '@shared/api/events'
import { Skeleton } from '@shared/ui/skeleton'
import { EventCard } from './EventCard'

type AttendanceState = Event['myState']

/**
 * An attendance write in flight, held by the route and applied here until the refetch catches up.
 *
 * It carries `userId` because the card's panel can answer for anyone (ADR-0003): a teammate's chip
 * has to move on tap just as the viewer's own pill does, and both come from this one record. The
 * panel counts its fractions from the attendances it renders, so patching the entry moves the chip
 * and the count together — which is why this does not need to touch `roster` (see attendance-cache,
 * which leaves it to the server for the same reason).
 */
export interface OptimisticAnswer {
  eventId: string
  userId: string
  state: AttendanceState
}

interface EventListViewProps {
  /** Already filtered, already sorted, and with the hero event removed by the container. */
  events: Event[]
  isLoading?: boolean
  error?: unknown
  emptyMessage?: string
  /** Injected so relative labels are deterministic in stories; defaults to the real clock. */
  now?: Date
  /** Fires the viewer's attendance write for one event. Wired by the page container (the route). */
  onRespond?: (eventId: string, state: AttendanceState) => void
  /** The answer whose write is in flight, to show on its card meanwhile. */
  optimistic?: OptimisticAnswer | null
  /** The viewer, so an optimistic answer can tell "my own pill" from "a teammate's chip" apart. */
  currentUserId?: string | null
  /** Every card's roster panel starts expanded — the member's `Keep open` preference (ADR-0030 §6). */
  defaultRosterOpen?: boolean
  /**
   * What each card's roster disclosure opens onto. A function of the event because the panel is
   * built per event; left out, every card falls back to the position pips it has always shown.
   */
  rosterPanel?: (event: Event) => ReactNode | null
}

/**
 * Presentational list region of the events page. Renders one of four states from props the
 * container (the route) hands down — loading / error / empty / data — so each state is testable in
 * isolation (see EventListView.stories.tsx).
 *
 * The list is flat and chronological: the date chit on each card carries the date, so the old
 * This Week / Later grouping headings are gone. Sorting, filtering and hero extraction stay in the
 * container; this component renders exactly the events it is given, in the order it is given them.
 */
export function EventListView({
  events,
  isLoading = false,
  error,
  emptyMessage = 'No upcoming events.',
  now,
  onRespond,
  optimistic,
  currentUserId,
  defaultRosterOpen,
  rosterPanel,
}: EventListViewProps) {
  // Data wins: keep showing cached events even when a background refetch is loading or has errored,
  // so a transient failure never blanks a list the user is already looking at.
  if (events.length === 0) {
    if (isLoading) return <EventListSkeleton />
    if (error) return <p className="mt-4 text-sm text-red">Couldn&apos;t load events.</p>
    // No way out of a filtered-to-empty list here any more: `Clear filters` moved up beside the
    // filter trigger, where it is visible whenever a filter is active rather than only once one has
    // already emptied the list (ADR-0030 §2).
    return <p className="mt-4 text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {events.map((event, idx) => {
        // Apply the optimistic pick only until the refreshed list reports the same answer: while it
        // differs the write is still settling, so show the pick and keep the badge pending (⑤); once
        // the list catches up the row is real again. A failed write is dropped by the container.
        const held = optimistic?.eventId === event.id ? optimistic : null
        const settling = held != null && held.state !== stateOf(event, held.userId)
        const shown = settling ? withAnswer(event, held.userId, held.state, held.userId === currentUserId) : event
        return (
          <EventCard
            key={event.id}
            event={shown}
            index={idx}
            now={now}
            myState={shown.myState}
            pending={settling}
            onRespond={(state) => onRespond?.(event.id, state)}
            defaultRosterOpen={defaultRosterOpen}
            rosterPanel={rosterPanel?.(shown)}
          />
        )
      })}
    </div>
  )
}

/** The answer the list currently reports for one member — the viewer's own is `myState`. */
function stateOf(event: Event, userId: string): AttendanceState {
  return event.attendances.find((a) => a.userId === userId)?.state ?? event.myState
}

/**
 * The event as it would be once the in-flight write lands: the member's entry patched, and `myState`
 * with it when that member is the viewer. Immutable, so dropping the optimistic answer restores the
 * original by simply not applying it.
 *
 * `roster` is deliberately untouched, exactly as `attendance-cache` leaves it: its `openSlots` and
 * `state` are the backend's tested authority (#219), and a second implementation here would be free
 * to drift from it. The lineup panel is unaffected because it counts its own fractions from
 * `attendances`; the readiness badge is the one surface that stays briefly stale, and it renders a
 * pending state meanwhile.
 */
function withAnswer(event: Event, userId: string, state: AttendanceState, isSelf: boolean): Event {
  return {
    ...event,
    myState: isSelf ? state : event.myState,
    attendances: event.attendances.map((a) => (a.userId === userId ? { ...a, state } : a)),
  }
}

/** A few skeleton cards mirroring EventCard's date-block layout, shown while the first load runs. */
function EventListSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3" role="status" aria-label="Loading events">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm">
          <div className="flex gap-3.5">
            <Skeleton className="h-[62px] w-[54px] shrink-0 rounded-[15px]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
          <div className="mt-3 border-t border-border/40 pt-3">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
