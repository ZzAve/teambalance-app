import type { Event } from '@shared/api/events'
import { Skeleton } from '@shared/ui/skeleton'
import { EventCard } from './EventCard'

interface EventListViewProps {
  /** Already filtered, already sorted, and with the hero event removed by the container. */
  events: Event[]
  isLoading?: boolean
  error?: unknown
  emptyMessage?: string
  /** Injected so relative labels are deterministic in stories; defaults to the real clock. */
  now?: Date
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
}: EventListViewProps) {
  // Data wins: keep showing cached events even when a background refetch is loading or has errored,
  // so a transient failure never blanks a list the user is already looking at.
  if (events.length === 0) {
    if (isLoading) return <EventListSkeleton />
    if (error) return <p className="mt-4 text-sm text-red-500">Couldn&apos;t load events.</p>
    return <p className="mt-4 text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {events.map((event, idx) => (
        <EventCard key={event.id} event={event} index={idx} now={now} />
      ))}
    </div>
  )
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
