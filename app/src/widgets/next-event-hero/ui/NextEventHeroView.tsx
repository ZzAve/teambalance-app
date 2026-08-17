import { Link } from '@tanstack/react-router'
import { Check, Clock, MapPin, X } from 'lucide-react'
import type { Event } from '@shared/api/events'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { heroCountdown } from '../lib/countdown'

interface NextEventHeroViewProps {
  event: Event
  /** The viewer's own response — drives the CTA styling and the status line. */
  myState: AttendanceState
  /** An RSVP is in flight; both buttons are held until it settles. */
  isSaving?: boolean
  onRespond: (state: AttendanceState) => void
  /** Injected so the countdown is deterministic in stories; defaults to the real clock. */
  now?: Date
}

/** The status line's second clause — what the viewer has (or hasn't) said. */
const MY_STATE_TEXT: Record<AttendanceState, string> = {
  ATTENDING: "you're in",
  ABSENT: "you're out",
  MAYBE: 'you said maybe',
  NOT_RESPONDED: "you haven't replied",
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
}: NextEventHeroViewProps) {
  const date = new Date(event.startTime)
  const countdown = heroCountdown(event.startTime, now)
  const going = myState === 'ATTENDING'
  const out = myState === 'ABSENT'

  return (
    <section
      aria-label="Next up"
      className="relative mt-4 overflow-hidden rounded-3xl p-4 text-white"
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
        <span className="font-display block text-[22px] font-extrabold leading-none">
          {countdown.value}
        </span>
        <span className="text-[10px] uppercase tracking-[0.08em] opacity-85">{countdown.unit}</span>
      </div>

      {/* The passive rows fade with a colour alpha (text-white/xx), never with `opacity`: an
          element with opacity < 1 forms its own stacking context and would paint *above* the
          title's stretched overlay, punching a dead hole in the card's hit area. */}
      <p className="pr-12 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
        Next up
      </p>

      <h3 className="font-display mb-1 mt-2 pr-12 text-[21px] font-extrabold leading-[1.08]">
        {/* Stretched-link pattern, as EventCard uses in the list below: the card is not an anchor,
            the title's after:inset-0 overlay makes the whole hero open the event. The controls that
            live inside it — the RSVP buttons, the maps link — are lifted back above the overlay with
            relative z-10, so widening the target costs none of them.
            Hover and focus hang off this link rather than a `group` on the card, because the overlay
            *is* the link's own hit area: the wash and the underline then answer exactly where a tap
            would navigate, and stay quiet over the controls, which are not part of it. The ring is
            inset so `overflow-hidden` can't clip it, and traces the real target — the whole card. */}
        <Link
          to="/events/$eventId"
          params={{ eventId: event.id }}
          className="after:absolute after:inset-0 after:rounded-3xl after:bg-white/0 after:transition-colors after:duration-200 hover:underline hover:after:bg-white/[0.07] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-white"
        >
          {event.title}
        </Link>
      </h3>

      <p className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/95">
        <Clock size={13} className="shrink-0" />
        {date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
        {' · '}
        {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
      </p>

      {event.location && (
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-white/95">
          <MapPin size={13} className="shrink-0" />
          {/* An address is worth a tap of its own, exactly as in the list card below. It is a
              sibling of the card link rather than nested inside it (an <a> in an <a> is invalid
              HTML), and relative z-10 lifts it above the stretched overlay. */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
          >
            {event.location}
          </a>
        </p>
      )}

      <p className="mt-2.5 text-[13px] text-white/90">
        {event.attendanceSummary.attending} going · {MY_STATE_TEXT[myState]}
      </p>

      {/* The answer the viewer has given is the solid button; the other one recedes. With no answer
          yet, "I'm in" is solid because it is the invitation, not because it has been chosen. */}
      <div className="relative z-10 mt-3.5 flex gap-2">
        <button
          aria-pressed={going}
          disabled={isSaving}
          onClick={() => onRespond('ATTENDING')}
          style={out ? undefined : { color: 'var(--color-green-dark)' }}
          className={[
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95',
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
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95',
            out ? 'bg-white' : going ? 'bg-white/12 text-white' : 'bg-white/20 text-white',
            isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          ].join(' ')}
        >
          <X size={16} />
          Can&apos;t make it
        </button>
      </div>
    </section>
  )
}
