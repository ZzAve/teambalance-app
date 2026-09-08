import type { EventRoster } from '@shared/api/events'
import { rosterChip, rosterRows, type RosterTone } from '../lib/roster-view'

interface RosterBarProps {
  roster: EventRoster
}

const CHIP_TONE: Record<RosterTone, string> = {
  covered: 'bg-green/10 text-green-dark',
  short: 'bg-gold/15 text-gold-dark',
  critical: 'bg-red/10 text-red',
}

const TONE_TEXT: Record<RosterTone, string> = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

/**
 * A compact, always-visible roster overview: how full the squad is, a progress track, and a chip per
 * targeted position coloured by its tone. Meant to be pinned above the attendee list so completeness
 * stays one glance away however far you scroll a large squad — the thing a flat list loses.
 *
 * Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
 * status: the chips come from `rosterRows`, the headline chip from `rosterChip`, and the counts are
 * server-owned (#219).
 *
 * Three shapes, because a roster can be targeted in two different ways or not at all (#271 (6)):
 *
 *   - **Positions targeted** — the fraction counts *slots*, and each position gets a chip.
 *   - **A headcount target only** — the fraction counts *people* against `totalTarget`. No chips:
 *     nothing is targeted per position, so there is nothing to list.
 *   - **A tally** — tracking on, nothing targeted. The plain count, and deliberately **no progress
 *     track**: a bar with no denominator would assert exactly the judgement `rosterChip` withholds
 *     for this state.
 *
 * Only a roster with tracking switched off renders nothing — a social is not a roster event, and the
 * route falls back to the role breakdown. The two headcount shapes were missing until this page
 * caught up with the card: the card said "4 more needed", you tapped through, and the number was gone.
 */
export function RosterBar({ roster }: RosterBarProps) {
  const rows = rosterRows(roster).filter((row) => row.pips.length > 0)
  const byPosition = rows.length > 0

  // A social: not a roster event, so there is no overview to give.
  if (!byPosition && !roster.trackRoster) return null

  // What the fraction is *of* differs per shape: slots where positions are targeted, people where
  // the target is a headcount, and nothing at all for a tally.
  const slots = rows.reduce((sum, row) => sum + row.pips.length, 0)
  const target = byPosition ? slots : roster.totalTarget
  const filled = byPosition ? slots - roster.openSlots : roster.totalAttending
  const met = target != null && filled >= target
  const headline = target == null ? `${filled} going` : `${filled}/${target} ${byPosition ? 'spots' : 'going'}`
  // Null for a tally — no denominator, no track.
  const pct = target == null || target === 0 ? null : Math.min(100, Math.round((filled / target) * 100))
  const chip = rosterChip(roster)

  return (
    <div className="border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3">
      <div className={`flex items-baseline justify-between gap-3 ${pct == null && !byPosition ? '' : 'mb-2'}`}>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Roster</span>
        <span className="flex items-baseline gap-1.5">
          <span className={`font-display text-sm font-bold tabular-nums ${met ? 'text-green-dark' : 'text-foreground'}`}>
            {headline}
          </span>
          {chip && <span className={`text-xs font-semibold ${TONE_TEXT[chip.tone]}`}>· {chip.text}</span>}
        </span>
      </div>

      {pct != null && (
        <div
          data-slot="roster-track"
          className={`h-1.5 overflow-hidden rounded-full bg-muted ${byPosition ? 'mb-2.5' : ''}`}
        >
          <div
            className="h-full rounded-full bg-green transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {byPosition && (
        <div className="flex flex-wrap gap-1.5">
          {rows.map((row) => (
            <span
              key={row.id}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${CHIP_TONE[row.tone ?? 'short']}`}
            >
              {row.label} {row.countLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
