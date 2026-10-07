import { Link } from '@tanstack/react-router'
import { useId, useState, type ReactNode } from 'react'
import { Check, ChevronDown, Clock, MapPin, X } from 'lucide-react'
import type { Event } from '@shared/api/events'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { ReadinessBadge } from '@entities/event/ui/ReadinessBadge'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { MapsLink } from '@shared/ui/MapsLink'
import { heroCountdown } from '../lib/countdown'
import { useTeamRoutes } from '@shared/lib/team-routes'

interface NextEventHeroViewProps {
  event: Event
  /** The viewer's own response — drives the CTA styling and the status line. */
  myState: AttendanceState
  /** An RSVP is in flight; both buttons are held until it settles. */
  isSaving?: boolean
  onRespond: (state: AttendanceState) => void
  /** Injected so the countdown is deterministic in stories; defaults to the real clock. */
  now?: Date
  /**
   * The lineup, behind the same disclosure the list cards use (#386). It was always open once —
   * the next event is the one whose roster matters right now — but open it filled a phone's whole
   * first screen, and a member opening the app to see what is coming saw one event. The verdict
   * badge keeps the one-glance news; the roster is a tap away. Injected for the same reason as on
   * the card — it is built from widgets this View should not have to wire.
   */
  lineup?: ReactNode
  /** Start the lineup open — the member's `Keep open` preference, as on every card (ADR-0030 §6). */
  defaultLineupOpen?: boolean
}

/** The status line's second clause — what the viewer has (or hasn't) said. */
const MY_STATE_TEXT: Record<AttendanceState, string> = {
  ATTENDING: "you're in",
  ABSENT: "you're out",
  MAYBE: 'you said maybe',
  NOT_RESPONDED: "you haven't responded",
}

/**
 * The Next Up hero: the most imminent event, big, with its countdown and an inline RSVP so the
 * commonest action on the page costs no navigation.
 *
 * Prop-only, and mounted conditionally — the parent decides whether there is a hero at all
 * (`selectHeroEvent`), and drops the event from the list below so it never renders twice. There is
 * deliberately no empty state here: when nothing is near, the page has no hero, not a hero saying
 * nothing is near.
 */
export function NextEventHeroView({
  event,
  myState,
  isSaving = false,
  onRespond,
  now = new Date(),
  lineup,
  defaultLineupOpen = false,
}: NextEventHeroViewProps) {
  const routes = useTeamRoutes()
  const [lineupOpen, setLineupOpen] = useState(defaultLineupOpen)
  // `Keep open` is a preference, not merely an initial value: when it flips, follow it — the same
  // render-time reset EventAnswerRow does, so the hero and the cards open and close together.
  const [appliedDefault, setAppliedDefault] = useState(defaultLineupOpen)
  if (appliedDefault !== defaultLineupOpen) {
    setAppliedDefault(defaultLineupOpen)
    setLineupOpen(defaultLineupOpen)
  }
  const lineupId = useId()
  // The same noun the card's disclosure uses: an untracked social has no positions, so its panel is
  // its people.
  const panelNoun = event.roster.trackRoster ? 'lineup' : "who's coming"
  const date = new Date(event.startTime)
  const countdown = heroCountdown(event.startTime, now)
  const going = myState === 'ATTENDING'
  const out = myState === 'ABSENT'

  return (
    <section
      aria-label="Next up"
      className="relative mt-4 overflow-hidden rounded-lg p-4 text-white"
      style={{
        background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)',
        boxShadow: '0 14px 34px rgba(34, 92, 156, 0.18)',
      }}
    >
      {/* Soft highlight, purely decorative */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-[150px] w-[150px] rounded-full bg-white/15 blur-sm"
      />

      {/* pointer-events-none: this block sits above the title's stretched overlay (z-10 keeps it
          clear of the decorative blur), so without it the countdown would be a dead patch. */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 text-right">
        <span className="font-display block text-title font-extrabold leading-none">
          {countdown.value}
        </span>
        <span className="text-caption opacity-85">{countdown.unit}</span>
      </div>

      {/* The passive rows fade with a colour alpha (text-white/xx), never with `opacity`: an
          element with opacity < 1 forms its own stacking context and would paint *above* the
          title's stretched overlay, punching a dead hole in the card's hit area. */}
      <div className="flex items-center gap-2 pr-12">
        <SectionLabel as="p" className="text-white/90">
          Next up
        </SectionLabel>
        {/* The card's type tag, in white: the type's own tint has no contrast on the green. */}
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-caption font-semibold">
          {event.eventType.name}
        </span>
      </div>

      <h3 className="font-display mb-1 mt-2 pr-12 text-title font-extrabold leading-[1.08]">
        {/* Stretched-link pattern, as EventCard uses in the list below: the card is not an anchor,
            the title's after:inset-0 overlay makes the whole hero open the event. The controls that
            live inside it — the RSVP buttons, the maps link — are lifted back above the overlay with
            relative z-10, so widening the target costs none of them.
            Hover and focus hang off this link rather than a `group` on the card, because the overlay
            *is* the link's own hit area: the wash and the underline then answer exactly where a tap
            would navigate, and stay quiet over the controls, which are not part of it. The ring is
            inset so `overflow-hidden` can't clip it, and traces the real target — the whole card. */}
        <Link
          to={routes.event(event.id)}
          className="after:absolute after:inset-0 after:rounded-lg after:bg-white/0 after:transition-colors after:duration-200 hover:underline hover:after:bg-white/[0.07] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-white"
        >
          {event.title}
        </Link>
      </h3>

      <p className="flex flex-wrap items-center gap-1.5 text-small text-white/95">
        <Clock size={13} className="shrink-0" />
        {date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
        {' · '}
        {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
      </p>

      {event.location && (
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-small text-white/95">
          <MapPin size={13} className="shrink-0" />
          {/* An address is worth a tap of its own, exactly as in the list card below. It is a
              sibling of the card link rather than nested inside it (an <a> in an <a> is invalid
              HTML), and relative z-10 lifts it above the stretched overlay. */}
          <MapsLink
            location={event.location}
            className="relative z-10 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
          >
            {event.location}
          </MapsLink>
        </p>
      )}

      {event.description && (
        <p className="mt-1.5 line-clamp-2 text-small text-white/85">{event.description}</p>
      )}

      {/* The headcount and the viewer's answer on the left; the roster verdict on the right (#275).
          One row, not two: with no verdict to give the badge renders nothing and the row collapses
          to the height of the status line, so a social reserves no space for a chip it never shows.
          The badge is deliberately *not* lifted above the stretched overlay — it is information, not
          a control, so tapping it opens the event like the rest of the passive rows. */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="text-small text-white/90">
          {event.attendanceSummary.attending} going · {MY_STATE_TEXT[myState]}
        </p>
        <ReadinessBadge roster={event.roster} variant="hero" pending={isSaving} />
      </div>

      {/* The answer the viewer has given is the solid button; the other one recedes. With no answer
          yet, "I'm in" is solid because it is the invitation, not because it has been chosen.
          min-h-11 holds the 44px touch target (F7); px-3 keeps the label off the edge. */}
      <div className="relative z-10 mt-3.5 flex gap-2">
        <button
          aria-pressed={going}
          disabled={isSaving}
          onClick={() => onRespond('ATTENDING')}
          style={out ? undefined : { color: 'var(--color-green-dark)' }}
          className={[
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-small font-bold transition-all active:scale-95',
            out ? 'bg-white/20 text-white' : 'bg-white',
            isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          ].join(' ')}
        >
          <Check size={16} />
          I&apos;m in
        </button>
        <button
          aria-pressed={out}
          disabled={isSaving}
          onClick={() => onRespond('ABSENT')}
          style={out ? { color: 'var(--color-red)' } : undefined}
          className={[
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-small font-bold transition-all active:scale-95',
            out ? 'bg-white' : going ? 'bg-white/12 text-white' : 'bg-white/20 text-white',
            isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          ].join(' ')}
        >
          <X size={16} />
          Can&apos;t make it
        </button>
      </div>

      {/* The lineup's disclosure, a quieter row under the answers: it is a way in, not a third
          answer. Lifted above the stretched overlay like the buttons; min-h-11 keeps the target. */}
      {lineup && (
        <button
          type="button"
          aria-expanded={lineupOpen}
          aria-controls={lineupOpen ? lineupId : undefined}
          onClick={() => setLineupOpen((open) => !open)}
          className="relative z-10 mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-white/10 px-3 text-small font-semibold text-white/90 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {lineupOpen ? `Hide ${panelNoun}` : `Show ${panelNoun}`}
          <ChevronDown
            size={14}
            aria-hidden
            className={`transition-transform duration-200 ${lineupOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* On a light surface of its own: the panel is drawn in the card's palette. relative z-10 lifts
          its chips above the stretched overlay. */}
      {lineup && lineupOpen && (
        <div id={lineupId} className="relative z-10 mt-3 rounded-md bg-card p-3 text-foreground">
          {lineup}
        </div>
      )}
    </section>
  )
}
