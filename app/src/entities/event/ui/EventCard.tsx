import { Link } from '@tanstack/react-router'
import { Calendar, MapPin } from 'lucide-react'
import { Card } from '@shared/ui/card'
import type { Event } from '@shared/api/events'
import { EventTypeBadge } from './EventTypeBadge'
import { EventTypeIcon } from './EventTypeIcon'


export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const date = new Date(event.startTime)
  const { attendanceSummary: s } = event
  // const relativeChip = getRelativeTimeChip(date)

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      style={{ animationDelay: `${index * 60}ms` }}
      className="card-enter block"
    >
      <Card className="card-shadow p-4 transition-[box-shadow] hover:card-shadow-hover">
        {/* Top: icon + badge/title */}
        <div className="flex items-start gap-3.5">
          <EventTypeIcon type={event.eventType} size="sm" />
          <div className="min-w-0 flex-1">
            <EventTypeBadge type={event.eventType} />
            <p className="font-display mt-1 text-[17px] font-medium leading-tight">{event.title}</p>
          </div>
        </div>

        {/* Meta: date · time · location — indented to align with title */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1 pl-[50px] text-[13px] text-muted-foreground">
          <Calendar size={13} className="shrink-0 text-muted-foreground/60" />
          {date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'short' })}
          {' · '}
          {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          {event.location && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <MapPin size={13} className="shrink-0 text-muted-foreground/60" />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-blue hover:underline"
              >
                {event.location}
              </a>
            </>
          )}
        </div>

        {/* Bottom: status + attendance summary */}
        <div className="mt-3 border-t border-border/40 pt-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">
              ✓ {s.attending} going
            </span>
            <span className="text-xs text-muted-foreground">
              of {s.attending + s.maybe + s.absent + s.notResponded}
              {s.notResponded > 0 && (
                <> · <span className="opacity-60">{s.notResponded} pending</span></>
              )}
            </span>
          </div>
          {s.roleBreakdown.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {s.roleBreakdown.map(({ role, attending }) => (
                <span key={role} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {attending} {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
