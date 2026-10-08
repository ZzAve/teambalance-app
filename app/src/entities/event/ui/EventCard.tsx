import { Link } from '@tanstack/react-router'
import type { AttendanceState } from '@entities/attendance/model/attendance-state'
import { AlignLeft, Clock, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@shared/ui/card'
import { InfoRow } from '@shared/ui/InfoRow'
import type { Event } from '../api/events'
import { relativeEventLabel } from '../lib/relative-event-label'
import { EventDateChit } from './EventDateChit'
import { EventTypeBadge } from './EventTypeBadge'
import { RelativeTimeLabel } from './RelativeTimeLabel'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { EventAnswerRow } from './EventAnswerRow'

interface EventCardProps {
  event: Event
  /** The viewer's own answer — already carrying any optimistic pick from the page container. */
  myState: AttendanceState
  /** An attendance write is in flight for this event. */
  pending?: boolean
  /** Who set the viewer's answer, when it was not the viewer — resolved by the container (⑪). */
  setBy?: string | null
  onRespond: (state: AttendanceState) => void
  index?: number
  /** Injected so the relative label is deterministic in stories; defaults to the real clock. */
  now?: Date
  /** Start the roster panel expanded — the member's `Keep open` preference (ADR-0030 §6). */
  defaultRosterOpen?: boolean
  /** What the roster disclosure opens onto; see EventAnswerRow. Defaults to the position pips. */
  rosterPanel?: ReactNode | null
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
export function EventCard({
  event,
  myState,
  pending,
  setBy,
  onRespond,
  index = 0,
  now = new Date(),
  defaultRosterOpen,
  rosterPanel,
}: EventCardProps) {
  const routes = useTeamRoutes()
  const date = new Date(event.startTime)
  const label = relativeEventLabel(event.startTime, now)

  return (
    // Stretched-link pattern: the card itself is not an anchor. The title <Link> carries an
    // after:inset-0 overlay that makes the whole card clickable, so the answer row's controls can
    // sit above it as siblings rather than nested inside an <a>.
    <Card
      style={{ animationDelay: `${index * 60}ms` }}
      className="card-enter card-shadow relative p-4 transition-[box-shadow] hover:card-shadow-hover motion-reduce:transition-none"
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
            className="font-display mt-1 block text-lead font-medium leading-tight after:absolute after:inset-0"
          >
            {event.title}
          </Link>

          {/* One icon-marked line per detail — the chit already carries the date. The location is
              plain text: a maps link is a destination competing with the card's own (ADR-0030 §9).
              The references are not on the card for the same reason — see the detail page. */}
          <dl className="mt-3 space-y-2 text-small">
            <InfoRow icon={Clock} label="Time">
              <span className="font-semibold">
                {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </InfoRow>
            {event.location && (
              <InfoRow icon={MapPin} label="Location">
                {event.location}
              </InfoRow>
            )}
            {/* Clamped so a long description cannot stretch the card. */}
            {event.description && (
              <InfoRow icon={AlignLeft} label="Description">
                <p className="line-clamp-2 text-muted-foreground">{event.description}</p>
              </InfoRow>
            )}
          </dl>
        </div>
      </div>

      {/* Answer row. Sibling of the chit+body row, so its rule spans the full card width, and
          `relative z-10` so the whole strip — spacing included — sits above the stretched-link
          overlay: a thumb aiming slightly high at a disclosure must not navigate instead (#324).
          Most of the old `pt-3` moved into the triggers themselves, where it is tappable. */}
      <div className="relative z-10 mt-3 border-t border-border/40 pt-1">
        <EventAnswerRow
          roster={event.roster}
          myState={myState}
          pending={pending}
          setBy={setBy}
          onRespond={onRespond}
          defaultRosterOpen={defaultRosterOpen}
          rosterPanel={rosterPanel}
        />
      </div>
    </Card>
  )
}
