import type { EventRoster } from '@shared/api/events'
import { rosterChip, type RosterTone } from '../lib/roster-view'

interface ReadinessBadgeProps {
  roster: EventRoster
  /** A write is in flight: the roster the server last computed is now stale, so dim it while it settles. */
  pending?: boolean
  /**
   * Which ground the badge is drawn on (#275).
   *
   * `card` is the light surface the tints below are built for. `hero` is the Next Up hero's solid
   * green: `bg-green/15` over green is invisible there, so the chip inverts to solid white and the
   * tone survives in the dot alone. Same `rosterChip`, same words — only the paint differs.
   */
  variant?: 'card' | 'hero'
}

// Semantic colours, read against the attendance palette already on the card: green means "as it
// should be" (covered), gold "needs attention" (short), red "a problem" (nobody). Same three
// meanings the answer pill uses, so a card carrying both reads as one language.
const CHIP_TONE: Record<RosterTone, string> = {
  covered: 'bg-green/15 text-green-dark',
  short: 'bg-gold/20 text-gold-dark',
  critical: 'bg-red/15 text-red-dark',
}

const DOT_TONE: Record<RosterTone, string> = {
  covered: 'bg-green',
  short: 'bg-gold',
  critical: 'bg-red',
}

/**
 * The card row's right slot: the one-glance readiness verdict.
 *
 * Presentational — the verdict is `rosterChip`, already computed by the server (#219). Two roster
 * states carry no verdict (a social, and tracking-on-with-no-targets): rather than leave the row with
 * no team information at all, both fall back to a plain headcount from `roster.totalAttending` (⑥,
 * #271). That headcount counts coaches as players today — deliberately left as-is until #281. The
 * `hero` variant renders nothing instead, because that surface already prints the headcount itself.
 *
 * While an attendance write is in flight the badge shows a `pending` state (⑤): the roster is not
 * recomputed client-side (see `applyOptimisticAttendance`), so the last-known verdict is dimmed while
 * it settles rather than asserted as current — it is most prominent at the moment it is most stale.
 */
export function ReadinessBadge({ roster, pending = false, variant = 'card' }: ReadinessBadgeProps) {
  const chip = rosterChip(roster)
  const hero = variant === 'hero'
  const dim = pending ? 'animate-pulse opacity-60' : ''

  if (!chip) {
    // On the hero there is nothing to fall back to: its status line is already a headcount
    // ("10 going - you're in"), so a chip repeating that number would say the same thing twice.
    if (hero) return null

    // No verdict to give — say who is coming rather than nothing.
    return (
      <span aria-busy={pending} className={`text-xs font-semibold text-muted-foreground ${dim}`}>
        {roster.totalAttending} going
      </span>
    )
  }

  return (
    <span
      aria-busy={pending}
      // The hero's ink is the fixed --color-green-dark its own white "I'm in" button already uses.
      // `text-foreground` would be wrong there: the hero's ground stays green in both themes while
      // that token inverts, so the label would go near-white on a white chip in dark mode.
      style={hero ? { color: 'var(--color-green-dark)' } : undefined}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${hero ? 'bg-white' : CHIP_TONE[chip.tone]} ${dim}`}
    >
      <span className={`size-1.5 rounded-full ${DOT_TONE[chip.tone]}`} aria-hidden />
      {chip.text}
    </span>
  )
}
