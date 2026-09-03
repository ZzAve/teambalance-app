import { TriangleAlert } from 'lucide-react'
import type { EventRoster } from '@shared/api/events'
import {
  coveredSummary,
  headcountLine,
  oneToChase,
  rosterRows,
  unassignedNudge,
  type PipState,
  type RosterRow,
  type RosterTone,
} from '../lib/roster-view'

interface RosterPipsProps {
  roster: EventRoster
}

const COUNT_TONE: Record<RosterTone, string> = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

// A filled slot is a solid green dot; an open one an empty ring. A slot at a position with NOBODY
// gets a red ring rather than a neutral one — the row is not merely short, it is unstaffed.
const PIP_TONE: Record<PipState, string> = {
  filled: 'bg-green border-green',
  open: 'bg-transparent border-[#CDBFA6]',
  missing: 'bg-transparent border-red',
}

/**
 * The per-position body of the card's answer panel: the covered fraction, one row of slot pips per
 * position, and the "one to chase" / unassigned nudges beneath.
 *
 * Presentational and prop-only (ADR-0017): every number arrives already computed by the server, and
 * the pure mapping to words/pips lives in `../lib/roster-view` — reused verbatim from the old
 * `RosterDisclosure`. The caller decides whether there is a panel at all (`hasRosterPanel`).
 */
export function RosterPips({ roster }: RosterPipsProps) {
  const rows = rosterRows(roster)
  const covered = coveredSummary(roster)
  const chase = oneToChase(roster)
  const nudge = unassignedNudge(roster)
  const headcount = headcountLine(roster)

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Positions</span>
        <span className="text-[11px] font-bold text-foreground/70">{covered ?? headcount ?? ''}</span>
      </div>

      {rows.length === 0 ? (
        // No rows does NOT mean nobody is coming: attendees with no position get no row of their
        // own (the nudge below speaks for them), so only an empty event earns this copy.
        roster.totalAttending === 0 && <p className="text-[12.5px] text-muted-foreground">Nobody has answered yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <PositionRow key={row.id} row={row} />
          ))}
        </ul>
      )}

      {/* The secondary "X/Y going" — shown only when a headcount sits alongside position targets,
          where the covered fraction already owns the header. */}
      {covered && headcount && <p className="mt-2.5 text-[11.5px] text-muted-foreground">{headcount}</p>}

      {chase && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-[10px] bg-gold/15 px-2.5 py-2 text-[11.5px] text-foreground/80">
          <TriangleAlert size={13} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden />
          <span>
            <b>{chase.label}</b> still has no one — the one to chase.
          </span>
        </p>
      )}

      {nudge && <p className="mt-2 text-[11.5px] text-muted-foreground">{nudge}</p>}
    </div>
  )
}

function PositionRow({ row }: { row: RosterRow }) {
  return (
    <li className="grid grid-cols-[70px_1fr_auto] items-center gap-2.5">
      <span className="truncate text-[12.5px] text-foreground/80">{row.label}</span>
      <span className="flex flex-wrap items-center gap-1.5">
        {row.pips.map((pip, i) => (
          // Pips are decoration for the count beside them, which carries the same fact as text.
          <i key={i} aria-hidden className={`block size-[13px] rounded-full border-[1.5px] ${PIP_TONE[pip]}`} />
        ))}
        {row.surplus > 0 && <span className="text-[11px] font-semibold text-green-dark">+{row.surplus}</span>}
      </span>
      <span
        className={`text-right text-xs font-bold tabular-nums ${row.tone ? COUNT_TONE[row.tone] : 'text-muted-foreground'}`}
      >
        {row.countLabel}
      </span>
    </li>
  )
}
