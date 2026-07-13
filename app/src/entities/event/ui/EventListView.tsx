import type { Event } from '@shared/api/events'
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
    if (isLoading) return <p className="mt-4 text-muted-foreground">Loading...</p>
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
