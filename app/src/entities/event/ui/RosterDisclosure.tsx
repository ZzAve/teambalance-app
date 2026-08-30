import { useId, useState } from 'react'
import { ChevronDown, TriangleAlert } from 'lucide-react'
import type { EventRoster } from '@shared/api/events'
import {
  coveredSummary,
  hasRosterPanel,
  headcountLine,
  oneToChase,
  rosterChip,
  rosterRows,
  unassignedNudge,
  type PipState,
  type RosterRow,
  type RosterTone,
} from '../lib/roster-view'

interface RosterDisclosureProps {
  roster: EventRoster
  /** Start expanded. Collapsed by default so the panel never clutters the list. */
  defaultOpen?: boolean
}

// Semantic colours, read against the attendance palette already on the card: green means "as it
// should be" (attending / covered), gold "needs attention" (maybe / short), red "a problem"
// (absent / nobody at all). Same three meanings, so a card carrying both reads as one language.
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
 * The roster panel on an event card: a collapsed status chip that expands to per-position slot pips.
 *
 * Read-only for everyone (#219) — it answers the coach's "is my lineup covered?" and the player's
 * "is my position needed?" with the same view. Collapsed by default so a list of events stays a list.
 *
 * Presentational and prop-only: every number arrives already computed by the server, and the pure
 * mapping to words/pips lives in `../lib/roster-view`. The only state here is whether the panel is
 * open, which is exactly the kind of local view state a story can drive.
 */
export function RosterDisclosure({ roster, defaultOpen = false }: RosterDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  // Not a roster event at all: no chip, no panel, no affordance hinting there is one.
  if (!hasRosterPanel(roster)) return null

  const chip = rosterChip(roster)
  const rows = rosterRows(roster)
  const covered = coveredSummary(roster)
  const chase = oneToChase(roster)
  const nudge = unassignedNudge(roster)
  const headcount = headcountLine(roster)

  return (
    <>
      {/* relative z-10 lifts the trigger above the card link's stretched overlay, so tapping the
          chip opens the panel instead of navigating to the event. */}
      <button
        type="button"
        aria-expanded={open}
        // Only while the panel exists: aria-controls pointing at an unmounted id is a dangling
        // reference. aria-expanded still carries the state when collapsed.
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-0.5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {chip ? (
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${CHIP_TONE[chip.tone]}`}
          >
            <span className={`size-1.5 rounded-full ${DOT_TONE[chip.tone]}`} aria-hidden />
            {chip.text}
          </span>
        ) : (
          // A tally has no status to report, but the rows are still worth a look.
          <span className="text-xs font-semibold text-muted-foreground">Positions</span>
        )}
        <ChevronDown
          size={15}
          aria-hidden
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        <span className="sr-only">{open ? 'Hide positions' : 'Show positions'}</span>
      </button>

      {open && (
        // relative z-10, like the trigger: without it the whole panel sits under EventCard's
        // after:inset-0 stretched link, and tapping a position row navigates to the event.
        <div id={panelId} className="relative z-10 mt-3 w-full border-t border-dashed border-border pt-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">
              Positions
            </span>
            <span className="text-[11px] font-bold text-foreground/70">{covered ?? headcount ?? ''}</span>
          </div>

          {rows.length === 0 ? (
            // No rows does NOT mean nobody is coming: attendees with no position get no row of their
            // own (the nudge below speaks for them), so only an empty event earns this copy.
            roster.totalAttending === 0 && (
              <p className="text-[12.5px] text-muted-foreground">Nobody has answered yet.</p>
            )
          ) : (
            <ul className="flex flex-col gap-2">
              {rows.map((row) => (
                <PositionRow key={row.id} row={row} />
              ))}
            </ul>
          )}

          {/* The secondary "X/Y going" — shown only when a headcount sits alongside position targets,
              where the covered fraction already owns the header. */}
          {covered && headcount && (
            <p className="mt-2.5 text-[11.5px] text-muted-foreground">{headcount}</p>
          )}

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
      )}
    </>
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
