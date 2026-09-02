import type { EventRoster } from '@shared/api/events'
import { rosterChip, type RosterTone } from '../lib/roster-view'

interface ReadinessBadgeProps {
  roster: EventRoster
  /** A write is in flight: the roster the server last computed is now stale, so dim it while it settles. */
  pending?: boolean
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
 * #271). That headcount counts coaches as players today — deliberately left as-is until #281.
 *
 * While an attendance write is in flight the badge shows a `pending` state (⑤): the roster is not
 * recomputed client-side (see `applyOptimisticAttendance`), so the last-known verdict is dimmed while
 * it settles rather than asserted as current — it is most prominent at the moment it is most stale.
 */
export function ReadinessBadge({ roster, pending = false }: ReadinessBadgeProps) {
  const chip = rosterChip(roster)
  const dim = pending ? 'animate-pulse opacity-60' : ''

  if (!chip) {
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
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${CHIP_TONE[chip.tone]} ${dim}`}
    >
      <span className={`size-1.5 rounded-full ${DOT_TONE[chip.tone]}`} aria-hidden />
      {chip.text}
    </span>
  )
}
