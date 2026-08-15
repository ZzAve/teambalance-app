import { Link } from '@tanstack/react-router'
import { Clock, MapPin } from 'lucide-react'
import { Card } from '@shared/ui/card'
import type { Event } from '@shared/api/events'
import { relativeEventLabel } from '../lib/relative-event-label'
import { EventDateChit } from './EventDateChit'
import { EventTypeBadge } from './EventTypeBadge'
import { ReferenceChips } from './ReferenceChips'
import { RelativeTimeLabel } from './RelativeTimeLabel'

interface EventCardProps {
  event: Event
  index?: number
  /** Injected so the relative label is deterministic in stories; defaults to the real clock. */
  now?: Date
}

/**
 * Date-block event card. The type-tinted calendar chit leads, carrying the date on its own, which
 * is what lets the list stay flat and chronological with no This Week / Later headings. The type
 * text tag stays next to it — colour alone is not a label.
 *
 * The divider above the attendance row is a child of the card, not of the text column, so it runs
 * edge-to-edge under the chit and the whole thing reads as one card rather than two panes.
 */
export function EventCard({ event, index = 0, now = new Date() }: EventCardProps) {
  const date = new Date(event.startTime)
  const { attendanceSummary: s } = event
  const invited = s.attending + s.maybe + s.absent + s.notResponded
  const label = relativeEventLabel(event.startTime, now)

  return (
    // Stretched-link pattern: the card itself is not an anchor. The title <Link> carries an
    // after:inset-0 overlay that makes the whole card clickable, so the maps link can be a sibling
    // anchor rather than a nested one (an <a> inside the card's <a> is invalid HTML).
    <Card
      style={{ animationDelay: `${index * 60}ms` }}
      className="card-enter card-shadow relative p-3.5 transition-[box-shadow] hover:card-shadow-hover"
    >
      <div className="flex gap-3.5">
        <EventDateChit date={date} type={event.eventType} />

        <div className="min-w-0 flex-1">
          {/* Tag row: type label left, relative time right */}
          <div className="flex items-center gap-2">
            <EventTypeBadge type={event.eventType} />
            {label && <RelativeTimeLabel label={label} />}
          </div>

          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="font-display mt-1 block text-[17px] font-medium leading-tight after:absolute after:inset-0"
          >
            {event.title}
          </Link>

          {/* Meta: time · location — the chit already carries the date */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <Clock size={13} className="shrink-0 text-muted-foreground/60" />
            <span className="font-semibold text-foreground">
              {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {event.location && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <MapPin size={13} className="shrink-0 text-muted-foreground/60" />
                {/* relative z-10 lifts this above the card link's stretched overlay so it stays clickable */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 hover:text-blue hover:underline"
                >
                  {event.location}
                </a>
              </>
            )}
          </div>

          {/* Reference chips — up to 2, then "+N" */}
          {event.references.length > 0 && (
            <div className="mt-2">
              <ReferenceChips references={event.references} max={2} />
            </div>
          )}
        </div>
      </div>

      {/* Attendance row. Sibling of the chit+body row, so its rule spans the full card width. */}
      <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
        <span className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">
          ✓ {s.attending} going
        </span>
        <span className="text-xs text-muted-foreground">
          of {invited}
          {s.notResponded > 0 && (
            <>
              {' · '}
              <span className="opacity-60">{s.notResponded} pending</span>
            </>
          )}
        </span>
      </div>
    </Card>
  )
}
