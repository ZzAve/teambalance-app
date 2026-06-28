import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useEvents } from '@shared/api/events'
import { EventCard } from '@entities/event/ui/EventCard'
import { CreateEventDialog } from '@features/create-event/ui/CreateEventDialog'

export const Route = createFileRoute('/')({
  component: EventListPage,
})

function EventListPage() {
  const [includePast, setIncludePast] = useState(false)
  const { data: events, isLoading } = useEvents(includePast)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <CreateEventDialog />
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includePast}
          onChange={(e) => setIncludePast(e.target.checked)}
          className="rounded"
        />
        Show past
      </label>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading...</p>}

      <div className="mt-4 flex flex-col gap-3">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {events?.length === 0 && (
          <p className="text-muted-foreground">No events yet.</p>
        )}
      </div>
    </div>
  )
}
