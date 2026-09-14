import { useState } from 'react'
import { coveredLine, lineupRows, verdictWord, type LineupMember, type LineupRow } from './lineup-model'
import { NameChip, ChipHole } from './NameChip'
import { AnswerSheet } from './AnswerSheet'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant D — "Roster". Throwaway. The one the review picked, rebuilt on what it said.
 *
 * Round two's D overlapped *faces*, and the verdict was: the idea is right but initials are not a
 * person while the app has no avatar photos. So the chip is now a name — identity dot plus first
 * name — and the density comes back through overlap rather than abbreviation. The fan tightens as a
 * position fills up, so a crowded row shows four or five characters each and a quiet one shows
 * whole names; the last chip is always whole.
 *
 * The rest of round two's D survives because the review kept it: the row's headline is a **word**
 * ("nobody yet", "1 spare") with the fraction demoted to the edge, and the three clusters — in,
 * holes, and everyone else — sit apart so "who is actually playing" is one shape.
 *
 * Tapping anyone opens the shared bottom sheet (`AnswerSheet`), which the review also picked.
 */

const VERDICT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

export function VariantD({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  return <RosterChips {...{ attendances, roster, currentUserId, onRespond, pending }} withAvatar />
}

/** Shared with variant G, which is this exact layout minus the identity dot. */
export function RosterChips({
  attendances,
  roster,
  currentUserId,
  onRespond,
  pending,
  withAvatar,
}: LineupPanelProps & { withAvatar: boolean }) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const [openId, setOpenId] = useState<string | null>(null)

  const all = rows.flatMap((r) => r.members)
  const open = all.find((m) => m.userId === openId) ?? null
  const openRow = rows.find((r) => r.members.some((m) => m.userId === openId))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <Row key={row.id} row={row} withAvatar={withAvatar} onPick={setOpenId} />
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
  withAvatar,
  onPick,
}: {
  row: LineupRow
  withAvatar: boolean
  onPick: (userId: string) => void
}) {
  const verdict = verdictWord(row)
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const maybe = row.members.filter((m) => m.state === 'MAYBE')
  const out = row.members.filter((m) => m.state === 'NOT_RESPONDED' || m.state === 'ABSENT')

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

      {/* Three fans with real air between them. Each is its own flex row, so a crowded "in" group
          tightens without dragging the people who are out along with it. */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {going.length > 0 && <Fan members={going} withAvatar={withAvatar} onPick={onPick} />}
        {row.openSlots > 0 && (
          <span className="flex">
            {Array.from({ length: row.openSlots }, (_, i) => (
              <ChipHole key={i} critical={row.tone === 'critical'} />
            ))}
          </span>
        )}
        {maybe.length > 0 && <Fan members={maybe} withAvatar={withAvatar} onPick={onPick} />}
        {out.length > 0 && (
          <span className="opacity-70">
            <Fan members={out} withAvatar={withAvatar} onPick={onPick} />
          </span>
        )}
        {row.members.length === 0 && row.openSlots === 0 && (
          <span className="text-[12px] text-muted-foreground">Nobody yet</span>
        )}
      </div>
    </div>
  )
}

/** `min-w-0` on the fan is what lets its chips shrink rather than push the row wide. */
function Fan({
  members,
  withAvatar,
  onPick,
}: {
  members: LineupMember[]
  withAvatar: boolean
  onPick: (userId: string) => void
}) {
  return (
    <span className="flex min-w-0 max-w-full items-center overflow-hidden">
      {members.map((m) => (
        <NameChip key={m.userId} member={m} withAvatar={withAvatar} onClick={() => onPick(m.userId)} />
      ))}
    </span>
  )
}
