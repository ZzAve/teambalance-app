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
 * A compact, always-visible roster overview: overall spots filled, a progress track, and a chip per
 * targeted position coloured by its tone. Meant to be pinned above the attendee list so completeness
 * stays one glance away however far you scroll a large squad — the thing a flat list loses.
 *
 * Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
 * status: the chips come from `rosterRows`, the headline chip from `rosterChip`, and the filled count
 * is `totalTarget − openSlots` (both server-owned; #219). Returns null when no position carries a
 * target — there is nothing to be a fraction of, and the route falls back to the headcount breakdown.
 */
export function RosterBar({ roster }: RosterBarProps) {
  const rows = rosterRows(roster).filter((row) => row.pips.length > 0)
  if (rows.length === 0) return null

  const target = rows.reduce((sum, row) => sum + row.pips.length, 0)
  const filled = target - roster.openSlots
  const pct = target === 0 ? 0 : Math.round((filled / target) * 100)
  const chip = rosterChip(roster)

  return (
    <div className="border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Roster</span>
        <span className="flex items-baseline gap-1.5">
          <span
            className={`font-display text-sm font-bold tabular-nums ${roster.openSlots === 0 ? 'text-green-dark' : 'text-foreground'}`}
          >
            {`${filled}/${target} spots`}
          </span>
          {chip && <span className={`text-xs font-semibold ${TONE_TEXT[chip.tone]}`}>· {chip.text}</span>}
        </span>
      </div>

      <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-green transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

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
    </div>
  )
}
