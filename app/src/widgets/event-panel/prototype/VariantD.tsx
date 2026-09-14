import { useState } from 'react'
import { coveredLine, lineupRows, verdictWord, type LineupMember, type LineupRow } from './lineup-model'
import { NameChip, OverflowChip, ChipHole } from './NameChip'
import { AnswerSheet } from './AnswerSheet'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant D — "Roster". Throwaway. The picked direction, rebuilt on its validation.
 *
 * A row per position: a name chip per member, overlapping into one group, the row's headline a word
 * ("nobody yet", "1 spare") with the fraction demoted to the edge, and three clusters — in, holes,
 * everyone else — set apart so "who is actually playing" is one shape.
 *
 * Two things changed after the pattern was checked against the research and measured against WCAG:
 *
 *   1. **Nothing is ever clipped.** Chips no longer shrink past their own text. The earlier version
 *      failed WCAG technique F104 — three of eighteen names became unreadable under the standard
 *      1.4.12 text-spacing override — and no amount of "only four characters are hidden" makes a
 *      clipped label conform. Overlap now eats the gap between chips, never the letters.
 *   2. **Crowding goes to `+N`, not to the letters.** Each cluster shows at most [CAP] chips and
 *      collapses the rest behind a counter that expands in place — the move Atlassian's and Emplifi's
 *      avatar groups already make, and the reason rule 1 is affordable.
 *
 * Variant G (the same layout without the identity dot) is gone: chip guidance recommends a leading
 * avatar precisely to keep chips apart in a crowd, and the dot carries the colour a teammate is known
 * by everywhere else in the app. Two characters of width is a cheap price for that.
 */

/** Five, following the avatar groups this borrows from — Atlassian caps at four, Emplifi at five. */
const CAP = 5

const VERDICT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

export function VariantD({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const [openId, setOpenId] = useState<string | null>(null)
  // Which clusters the viewer has unfolded, keyed `rowId:group`. Expanding one fan leaves the rest
  // collapsed — the point of the cap is that a long row stays short unless you ask.
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())

  const all = rows.flatMap((r) => r.members)
  const open = all.find((m) => m.userId === openId) ?? null
  const openRow = rows.find((r) => r.members.some((m) => m.userId === openId))

  const toggle = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (!next.delete(key)) next.add(key)
      return next
    })

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <Row key={row.id} row={row} expanded={expanded} onToggleFan={toggle} onPick={setOpenId} />
        ))}
      </div>

      <AnswerSheet
        member={open}
        position={openRow?.label}
        pending={pending}
        onRespond={onRespond}
        onClose={() => setOpenId(null)}
      />
    </div>
  )
}

function Row({
  row,
  expanded,
  onToggleFan,
  onPick,
}: {
  row: LineupRow
  expanded: ReadonlySet<string>
  onToggleFan: (key: string) => void
  onPick: (userId: string) => void
}) {
  const verdict = verdictWord(row)
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const maybe = row.members.filter((m) => m.state === 'MAYBE')
  const out = row.members.filter((m) => m.state === 'NOT_RESPONDED' || m.state === 'ABSENT')

  const fan = (group: string, members: LineupMember[], label: string) => (
    <Fan
      members={members}
      label={label}
      expanded={expanded.has(`${row.id}:${group}`)}
      onToggle={() => onToggleFan(`${row.id}:${group}`)}
      onPick={onPick}
    />
  )

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display truncate text-[14px] font-bold leading-none">{row.label}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          {verdict && (
            <span className={`text-[12px] font-semibold ${VERDICT_TONE[row.tone ?? 'short']}`}>{verdict}</span>
          )}
          <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
            {row.required == null ? `${row.attending}` : `${row.attending}/${row.required}`}
          </span>
        </span>
      </div>

      {/* Three fans with real air between them, each wrapping and capping on its own, so a crowded
          "in" group never drags the people who are out along with it. */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {going.length > 0 && fan('in', going, 'going')}
        {row.openSlots > 0 && (
          <span className="flex flex-wrap items-center">
            {Array.from({ length: row.openSlots }, (_, i) => (
              <ChipHole key={i} critical={row.tone === 'critical'} />
            ))}
          </span>
        )}
        {maybe.length > 0 && fan('maybe', maybe, 'maybe')}
        {out.length > 0 && <span className="opacity-70">{fan('out', out, 'out')}</span>}
        {row.members.length === 0 && row.openSlots === 0 && (
          <span className="text-[12px] text-muted-foreground">Nobody yet</span>
        )}
      </div>
    </div>
  )
}

/**
 * One cluster. Wraps rather than clipping, and shows `CAP` chips before collapsing the remainder —
 * `CAP - 1` plus the counter when it collapses, so the row never grows by adding the `+N`.
 */
function Fan({
  members,
  label,
  expanded,
  onToggle,
  onPick,
}: {
  members: LineupMember[]
  label: string
  expanded: boolean
  onToggle: () => void
  onPick: (userId: string) => void
}) {
  const overflows = members.length > CAP
  const shown = expanded || !overflows ? members : members.slice(0, CAP - 1)
  const hidden = members.length - shown.length

  return (
    <span className="flex max-w-full flex-wrap items-center">
      {shown.map((m) => (
        <NameChip key={m.userId} member={m} onClick={() => onPick(m.userId)} />
      ))}
      {(hidden > 0 || (expanded && overflows)) && (
        <OverflowChip hidden={hidden} expanded={expanded} label={label} onClick={onToggle} />
      )}
    </span>
  )
}
