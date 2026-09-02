import { Link } from '@tanstack/react-router'
import { Clock, MapPin } from 'lucide-react'
import { Card } from '@shared/ui/card'
import type { Event } from '@shared/api/events'
import { relativeEventLabel } from '../lib/relative-event-label'
import { EventDateChit } from './EventDateChit'
import { EventTypeBadge } from './EventTypeBadge'
import { ReferenceChips } from './ReferenceChips'
import { RelativeTimeLabel } from './RelativeTimeLabel'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { EventAnswerRow } from './EventAnswerRow'

type AttendanceState = Event['myState']

interface EventCardProps {
  event: Event
  /** The viewer's own answer — already carrying any optimistic pick from the page container. */
  myState: AttendanceState
  /** An attendance write is in flight for this event. */
  pending?: boolean
  onRespond: (state: AttendanceState) => void
  index?: number
  /** Injected so the relative label is deterministic in stories; defaults to the real clock. */
  now?: Date
}

/**
 * Date-block event card. The type-tinted calendar chit leads, carrying the date on its own, which
 * is what lets the list stay flat and chronological with no This Week / Later headings. The type
 * text tag stays next to it — colour alone is not a label.
 *
 * The bottom row answers exactly two questions (#271): *what did I say?* on the left, and *is this
 * event OK?* on the right — the whole row a single tap target opening the answer control. The old
 * `✓ 8 going · of 14 · 3 pending` counts are gone; they live on the detail page's tab bar.
 *
 * Prop-only (ADR-0017): `myState` arrives already optimistic and `onRespond` fires the write, both
 * owned by the page container (the events route). That seam is covered by the existing attendance
 * e2e; every rendered state here is a story.
 */
export function EventCard({ event, myState, pending, onRespond, index = 0, now = new Date() }: EventCardProps) {
  const routes = useTeamRoutes()
  const date = new Date(event.startTime)
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
            to={routes.event(event.id)}
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

      {/* Answer row. Sibling of the chit+body row, so its rule spans the full card width. */}
      <div className="mt-3 border-t border-border/40 pt-3">
        <EventAnswerRow roster={event.roster} myState={myState} pending={pending} onRespond={onRespond} />
      </div>
    </Card>
  )
}
