import type { Event } from '@shared/api/events'
import { Skeleton } from '@shared/ui/skeleton'
import { EventCard } from './EventCard'

export interface EventGroup {
  label: string
  events: Event[]
}

interface EventListViewProps {
  groups: EventGroup[]
  isLoading?: boolean
  error?: unknown
  emptyMessage?: string
}

/**
 * Presentational list region of the events page. Renders one of four states from props the
 * container (the route) hands down — loading / error / empty / grouped data — so each state is
 * testable in isolation (see EventListView.stories.tsx). Date-based grouping and filtering stay in
 * the container; this component only renders the groups it is given.
 */
export function EventListView({
  groups,
  isLoading = false,
  error,
  emptyMessage = 'No events yet.',
}: EventListViewProps) {
  // Data wins: keep showing cached events even when a background refetch is loading or has errored,
  // so a transient failure never blanks a list the user is already looking at.
  if (groups.length === 0) {
    if (isLoading) return <EventListSkeleton />
    if (error) return <p className="mt-4 text-sm text-red-500">Couldn&apos;t load events.</p>
    return <p className="mt-4 text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <>
      {groups.map((group, gi) => (
        <div key={group.label || 'past'} className={gi === 0 ? 'mt-4' : 'mt-6'}>
          {group.label && (
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </h3>
          )}
          <div className="flex flex-col gap-3">
            {group.events.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

/** A few skeleton cards mirroring EventCard's layout, shown while the first page of events loads. */
function EventListSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3" role="status" aria-label="Loading events">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
          <Skeleton className="mt-3 ml-[50px] h-3.5 w-1/2" />
          <div className="mt-3 border-t border-border/40 pt-3">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
