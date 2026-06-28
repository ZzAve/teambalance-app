import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import type { Event } from '@shared/api/events'

export function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startTime)
  const { attendanceSummary: s } = event

  return (
    <Link to="/events/$eventId" params={{ eventId: event.id }}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: event.type.color ?? '#888' }}
            />
            <span className="text-sm text-muted-foreground">{event.type.name}</span>
          </div>
          <CardTitle className="text-lg">{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
            {' '}
            {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {event.location && (
            <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
          )}
          <div className="mt-3 flex gap-3 text-sm">
            <span className="text-green font-medium">{s.attending}</span>
            <span className="text-gold font-medium">{s.maybe}</span>
            <span className="text-red-500 font-medium">{s.absent}</span>
            <span className="text-muted-foreground">{s.notResponded}?</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
