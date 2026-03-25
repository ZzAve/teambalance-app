import { createFileRoute, Link } from '@tanstack/react-router'
import { useEvent } from '@shared/api/events'
import { useUserStore } from '@shared/stores/user-store'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import { Card, CardContent } from '@shared/ui/card'
import { Button } from '@shared/ui/button'

export const Route = createFileRoute('/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const { data: event, isLoading } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (!event) return <p>Event not found.</p>

  const date = new Date(event.startTime)

  return (
    <div>
      <Link to="/">
        <Button variant="ghost" size="sm">&larr; Back</Button>
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: event.type.color ?? '#888' }}
          />
          <span className="text-sm text-muted-foreground">{event.type.name}</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold">{event.title}</h1>
        <p className="mt-1 text-muted-foreground">
          {date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {' at '}
          {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </p>
        {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
        {event.description && <p className="mt-2">{event.description}</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <div className="mt-3 flex flex-col gap-2">
          {event.attendances.map((a) => (
            <Card key={a.userId}>
              <CardContent className="flex items-center justify-between py-3">
                <span className={a.userId === currentUserId ? 'font-semibold' : ''}>
                  {a.displayName}
                </span>
                <AttendanceToggle
                  eventId={eventId}
                  userId={a.userId}
                  currentState={a.state}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
