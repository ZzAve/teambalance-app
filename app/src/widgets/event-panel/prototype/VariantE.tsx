import { useState } from 'react'
import { Check, HelpCircle, X } from 'lucide-react'
import { coveredLine, lineupRows, STATE_WORD, verdictWord, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import { Face } from './Face'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant E — "Court". Throwaway.
 *
 * The one that stops treating a lineup as a list. A volleyball position is not a category, it is a
 * *place*, and the team already thinks in the six rotation zones — so the panel draws the court and
 * puts each position where it actually stands. A hole then has a location: an empty Libero is a red
 * patch in the back middle, which lands before any word or number does.
 *
 * Structure that is true rather than decorative: the small 1–6 in each cell is the real rotation
 * number, and the cells are laid out in the real order (front row 4-3-2 behind the net, back row
 * 5-6-1), so anyone who plays the sport can read the diagram without a legend.
 *
 * **The risk this variant exists to expose:** positions are free text a team configures itself
 * (ADR/positions), so there is no guarantee they map to zones at all. The mapping below covers the
 * common English and Dutch names, then fills the remaining zones in the team's own configured
 * order, then benches whatever is left over — a team with four positions called "A" through "D"
 * still gets a coherent court, but the diagram stops meaning anything. If this variant wins, that
 * mapping has to become something a team can set, and that is a real feature, not a detail.
 */

/** Front row left→right, then back row left→right — the order a player reads a court in. */
const ZONE_ORDER = [4, 3, 2, 5, 6, 1]

const ZONE_FOR_LABEL: Record<string, number> = {
  'outside hitter': 4,
  buitenaanvaller: 4,
  'passer-loper': 4,
  'middle blocker': 3,
  middenaanvaller: 3,
  midden: 3,
  opposite: 2,
  diagonaal: 2,
  libero: 6,
  setter: 1,
  spelverdeler: 1,
}

const CELL_TONE = {
  covered: 'bg-green/15 border-green/45',
  short: 'bg-gold/20 border-gold/50',
  critical: 'bg-red/15 border-red/55',
}

const VERDICT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

export function VariantE({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const { court, bench } = placeOnCourt(rows)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const selected = rows.find((r) => r.id === selectedId) ?? null

  const select = (row: LineupRow) => {
    setSelectedId((id) => (id === row.id ? null : row.id))
    setEditing(null)
  }

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">On court</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <div className="overflow-hidden rounded-xl border border-blue/25 bg-blue/8">
        {/* The net. Not ornament — it is what tells you which half of the grid is the front row. */}
        <div
          aria-hidden
          className="h-2 border-b border-blue/30 bg-[repeating-linear-gradient(90deg,var(--color-blue)_0_1px,transparent_1px_5px)] opacity-40"
        />
        <div className="grid grid-cols-3 gap-1 p-1">
          {ZONE_ORDER.map((zone, i) => {
            const row = court.get(zone)
            return (
              <div key={zone} className={i === 3 ? 'col-start-1 border-t border-dashed border-blue/25 pt-1' : ''}>
                {row ? (
                  <ZoneCell
                    zone={zone}
                    row={row}
                    selected={selectedId === row.id}
                    onSelect={() => select(row)}
                  />
                ) : (
                  <span className="flex h-[84px] items-start justify-end rounded-lg border border-dashed border-blue/20 p-1.5 text-[9px] font-bold tabular-nums text-blue/35">
                    {zone}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {bench.length > 0 && (
        <div className="mt-2.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Off court</span>
          <div className="mt-1 flex flex-col gap-1.5">
            {bench.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => select(row)}
                className={`flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-left ${selectedId === row.id ? 'bg-muted' : ''}`}
              >
                <span className="w-[86px] shrink-0 truncate text-[12px] text-foreground/80">{row.label}</span>
                <span className="flex flex-1">
                  {row.members.map((m) => (
                    <Face key={m.userId} member={m} size={24} stacked />
                  ))}
                </span>
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-muted-foreground">
                  {row.attending}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* One detail strip for the whole diagram, under it: a court cell is far too small to hold
          names, and a popover over a 110px cell would cover the thing you are reading. */}
      {selected && (
        <div className="mt-2.5 rounded-xl border border-border/60 bg-muted/40 p-2">
          <div className="mb-1.5 flex items-baseline justify-between px-0.5">
            <span className="font-display text-[13.5px] font-bold">{selected.label}</span>
            <span className={`text-[11.5px] font-semibold ${VERDICT_TONE[selected.tone ?? 'short']}`}>
              {verdictWord(selected) ?? `${selected.attending} in`}
            </span>
          </div>
          <ul className="flex flex-col gap-0.5">
            {selected.members.map((m) => (
              <li key={m.userId}>
                <button
                  type="button"
                  aria-expanded={editing === m.userId}
                  onClick={() => setEditing((id) => (id === m.userId ? null : m.userId))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left"
                >
                  <Face member={m} size={24} selected={editing === m.userId} />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{m.displayName}</span>
                  <span className={`shrink-0 text-[11px] font-semibold ${STATE_TEXT[m.state]}`}>
                    {STATE_WORD[m.state]}
                  </span>
                </button>
                {editing === m.userId && (
                  <Picker
                    member={m}
                    pending={pending}
                    onRespond={(userId, state) => {
                      onRespond(userId, state)
                      setEditing(null)
                    }}
                  />
                )}
              </li>
            ))}
            {selected.members.length === 0 && (
              <li className="px-1 py-2 text-[12.5px] text-muted-foreground">
                Nobody plays {selected.label} yet — nobody to ask.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

function ZoneCell({
  zone,
  row,
  selected,
  onSelect,
}: {
  zone: number
  row: LineupRow
  selected: boolean
  onSelect: () => void
}) {
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const shown = going.slice(0, 3)

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex h-[84px] w-full flex-col justify-between rounded-lg border p-1.5 text-left ${CELL_TONE[row.tone ?? 'short']} ${selected ? 'ring-2 ring-foreground ring-offset-1 ring-offset-card' : ''}`}
    >
      <span className="flex w-full items-start justify-between gap-1">
        <span className="min-w-0 text-[10.5px] font-bold leading-tight">{row.label}</span>
        <span className="shrink-0 text-[9px] font-bold tabular-nums opacity-40">{zone}</span>
      </span>

      <span className="flex items-center">
        {shown.map((m) => (
          <Face key={m.userId} member={m} size={22} stacked />
        ))}
        {going.length > shown.length && (
          <span className="ml-1.5 text-[10px] font-bold text-foreground/60">+{going.length - shown.length}</span>
        )}
        {going.length === 0 && (
          <span className={`text-[10.5px] font-semibold ${row.required == null ? 'text-muted-foreground' : 'text-red'}`}>
            {row.required == null ? 'nobody' : 'empty'}
          </span>
        )}
      </span>

      <span className={`text-[11px] font-bold tabular-nums ${VERDICT_TONE[row.tone ?? 'short']}`}>
        {row.required == null ? `${row.attending} in` : `${row.attending}/${row.required}`}
      </span>
    </button>
  )
}

/**
 * Known labels take their real zone; whatever is left fills the free zones in the team's own
 * configured order; staff and anything that still does not fit go to the bench.
 */
function placeOnCourt(rows: LineupRow[]): { court: Map<number, LineupRow>; bench: LineupRow[] } {
  const court = new Map<number, LineupRow>()
  const rest: LineupRow[] = []

  const benched = (row: LineupRow) => row.isStaff || row.id === 'unassigned'

  for (const row of rows) {
    const zone = benched(row) ? undefined : ZONE_FOR_LABEL[row.label.trim().toLowerCase()]
    if (zone !== undefined && !court.has(zone)) court.set(zone, row)
    else rest.push(row)
  }

  const bench: LineupRow[] = []
  for (const row of rest) {
    const free = benched(row) ? undefined : ZONE_ORDER.find((z) => !court.has(z))
    if (free !== undefined) court.set(free, row)
    else bench.push(row)
  }

  return { court, bench }
}

const STATE_TEXT: Record<LineupState, string> = {
  ATTENDING: 'text-green-dark',
  MAYBE: 'text-gold-dark',
  NOT_RESPONDED: 'text-muted-foreground',
  ABSENT: 'text-red/80',
}

const OPTIONS: { value: LineupState; label: string; Icon: typeof Check; on: string; off: string }[] = [
  { value: 'ATTENDING', label: 'Going', Icon: Check, on: 'bg-green text-white border-green', off: 'border-green/30 text-green' },
  { value: 'MAYBE', label: 'Maybe', Icon: HelpCircle, on: 'bg-gold text-white border-gold', off: 'border-gold/30 text-gold-dark' },
  { value: 'ABSENT', label: "Can't", Icon: X, on: 'bg-red text-white border-red', off: 'border-red/30 text-red' },
]

function Picker({
  member,
  onRespond,
  pending,
}: {
  member: LineupMember
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  return (
    <div className="flex gap-1.5 px-1 pb-1.5 pt-1" role="group" aria-label={`${member.displayName}'s answer`}>
      {OPTIONS.map(({ value, label, Icon, on, off }) => (
        <button
          key={value}
          type="button"
          aria-pressed={member.state === value}
          disabled={pending}
          onClick={() => onRespond(member.userId, value)}
          className={`flex flex-1 items-center justify-center gap-1 rounded-lg border bg-card py-1.5 text-[12px] font-bold ${member.state === value ? on : off} ${pending ? 'opacity-60' : ''}`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}
