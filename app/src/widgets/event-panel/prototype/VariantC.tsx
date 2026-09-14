import { useState } from 'react'
import { Check, HelpCircle, Plus, UserPlus } from 'lucide-react'
import { Avatar } from '@shared/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@shared/ui/sheet'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import { coveredLine, lineupRows, STATE_WORD, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant C — "Lineup sheet". Throwaway.
 *
 * The one that refuses to treat the squad as a flat bag of people. A position is a set of *slots*,
 * so it draws them: one box per slot the team asked for, each holding either the person filling it
 * or the word Open. The requirement is not a fraction beside the row, it *is* the row — and the
 * members who are not in the lineup drop to a second, quieter lane underneath, because "Chris said
 * no" is a different kind of fact from "Anna is playing".
 *
 * It also reads the "change anybody's attendance" line as a **task** rather than a capability: an
 * Open slot is tappable and opens a sheet of exactly the people who could fill it — the position's
 * maybes, silents and noes — so filling a hole is one gesture rather than hunting for a name. The
 * avatar keeps the member's identity colour here, since the slot's own frame carries the state.
 *
 * The bet to judge: the extra structure is worth the width, and a bottom sheet is the right weight
 * for an edit on a list page (A and B both keep it inline).
 */

/**
 * Heavier than A's or B's colour, on purpose: this is the one variant whose circle keeps the
 * member's *identity* colour, so the state has to be carried entirely by the frame around it and the
 * badge on it. The first screenshot of this variant made the case — with a tint this weak, a green
 * teammate and a gold teammate who had both said yes read as two different answers.
 */
const SLOT_FRAME: Record<'ATTENDING' | 'MAYBE' | 'open' | 'empty', string> = {
  ATTENDING: 'border-2 border-green bg-green/10',
  MAYBE: 'border-2 border-dashed border-gold bg-gold/10',
  open: 'border-2 border-dashed border-muted-foreground/30 bg-transparent',
  empty: 'border-2 border-dashed border-red/60 bg-red/5',
}

const BADGE: Record<'ATTENDING' | 'MAYBE', { className: string; Icon: typeof Check }> = {
  ATTENDING: { className: 'bg-green', Icon: Check },
  MAYBE: { className: 'bg-gold', Icon: HelpCircle },
}

const BENCH_TONE: Record<LineupState, string> = {
  ATTENDING: 'text-green-dark',
  MAYBE: 'text-gold-dark',
  NOT_RESPONDED: 'text-muted-foreground',
  ABSENT: 'text-red/80',
}

type Target =
  | { kind: 'member'; member: LineupMember; position: string }
  | { kind: 'fill'; row: LineupRow }

export function VariantC({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const [target, setTarget] = useState<Target | null>(null)

  // Re-read the open member from the fresh rows, so the sheet reflects the answer just picked
  // instead of the snapshot it was opened with.
  const live =
    target?.kind === 'member'
      ? rows.flatMap((r) => r.members).find((m) => m.userId === target.member.userId) ?? target.member
      : null
  const liveRow = target?.kind === 'fill' ? rows.find((r) => r.id === target.row.id) ?? target.row : null

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <PositionSheetRow key={row.id} row={row} onOpen={setTarget} />
        ))}
      </div>

      <Sheet open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <SheetContent>
          {live && target?.kind === 'member' && (
            <>
              <SheetHeader>
                <SheetTitle>{live.displayName}</SheetTitle>
                <SheetDescription>
                  {target.position} · currently {STATE_WORD[live.state].toLowerCase()}
                  {!live.isSelf && ' · you are answering for them'}
                </SheetDescription>
              </SheetHeader>
              <AttendanceToggle
                value={live.state}
                disabled={pending}
                onToggle={(state) => {
                  onRespond(live.userId, state)
                  setTarget(null)
                }}
              />
            </>
          )}

          {liveRow && (
            <>
              <SheetHeader>
                <SheetTitle>Fill {liveRow.label}</SheetTitle>
                <SheetDescription>
                  {liveRow.openSlots} {liveRow.openSlots === 1 ? 'slot' : 'slots'} still open — mark someone going.
                </SheetDescription>
              </SheetHeader>
              <ul className="flex flex-col gap-1">
                {liveRow.members
                  .filter((m) => m.state !== 'ATTENDING')
                  .map((m) => (
                    <li key={m.userId}>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          onRespond(m.userId, 'ATTENDING')
                          setTarget(null)
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                      >
                        <Avatar userId={m.userId} name={m.displayName} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{m.displayName}</span>
                          <span className={`block text-xs ${BENCH_TONE[m.state]}`}>{STATE_WORD[m.state]}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-green px-3 py-1 text-xs font-bold text-white">
                          Going
                        </span>
                      </button>
                    </li>
                  ))}
                {liveRow.members.every((m) => m.state === 'ATTENDING') && (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    Nobody plays {liveRow.label} — nobody to ask.
                  </li>
                )}
              </ul>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PositionSheetRow({ row, onOpen }: { row: LineupRow; onOpen: (target: Target) => void }) {
  // The lineup lane: who is actually in, then the holes. Maybes take a slot visually — they are the
  // reason the row might yet be fine — but they are drawn dashed so they never read as settled.
  const inLineup = row.members.filter((m) => m.state === 'ATTENDING')
  const maybes = row.members.filter((m) => m.state === 'MAYBE')
  const bench = row.members.filter((m) => m.state === 'ABSENT' || m.state === 'NOT_RESPONDED')

  return (
    <div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-foreground/70">{row.label}</span>
        {row.required != null ? (
          <span
            className={`text-[11px] font-bold tabular-nums ${row.tone === 'critical' ? 'text-red' : row.tone === 'covered' ? 'text-green-dark' : 'text-gold-dark'}`}
          >
            {row.attending}/{row.required} slots
          </span>
        ) : (
          <span className="text-[11px] font-bold tabular-nums text-muted-foreground">{row.attending} in</span>
        )}
        {row.isStaff && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">not counted</span>}
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {inLineup.map((m) => (
          <SlotBox key={m.userId} member={m} frame="ATTENDING" onClick={() => onOpen({ kind: 'member', member: m, position: row.label })} />
        ))}
        {maybes.map((m) => (
          <SlotBox key={m.userId} member={m} frame="MAYBE" onClick={() => onOpen({ kind: 'member', member: m, position: row.label })} />
        ))}
        {Array.from({ length: row.openSlots }, (_, i) => (
          <button
            key={`open-${i}`}
            type="button"
            onClick={() => onOpen({ kind: 'fill', row })}
            className={`flex h-[62px] w-[60px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl ${SLOT_FRAME[row.tone === 'critical' ? 'empty' : 'open']} text-[10px] font-semibold ${row.tone === 'critical' ? 'text-red' : 'text-muted-foreground'}`}
          >
            {row.tone === 'critical' ? <UserPlus size={15} /> : <Plus size={15} />}
            Open
            <span className="sr-only">slot in {row.label} — pick someone to fill it</span>
          </button>
        ))}
        {inLineup.length === 0 && maybes.length === 0 && row.openSlots === 0 && (
          <span className="py-3 text-[12px] text-muted-foreground">Nobody in yet</span>
        )}
      </div>

      {/* The quiet lane: settled noes and silences. Same fact, a third of the weight. */}
      {bench.length > 0 && (
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px]">
          {bench.map((m) => (
            <button
              key={m.userId}
              type="button"
              onClick={() => onOpen({ kind: 'member', member: m, position: row.label })}
              className={`underline-offset-2 hover:underline ${BENCH_TONE[m.state]}`}
            >
              {m.displayName}
              <span className="ml-1 opacity-70">{m.state === 'ABSENT' ? "can't" : '—'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SlotBox({
  member,
  frame,
  onClick,
}: {
  member: LineupMember
  frame: 'ATTENDING' | 'MAYBE'
  onClick: () => void
}) {
  const { className: badgeClass, Icon } = BADGE[frame]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[62px] w-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 ${SLOT_FRAME[frame]} ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      <span className="relative">
        <Avatar userId={member.userId} name={member.displayName} />
        {/* The answer, pinned to the person — the avatar's own colour is their identity, not their
            state, so it cannot be the thing that says whether they are coming. */}
        <span
          aria-hidden
          className={`absolute -bottom-0.5 -right-0.5 flex size-[13px] items-center justify-center rounded-full text-white ring-2 ring-card ${badgeClass}`}
        >
          <Icon size={8} />
        </span>
      </span>
      <span className="w-full truncate text-center text-[10px] font-semibold leading-none">
        {member.displayName.split(' ')[0]}
      </span>
      <span className="sr-only">
        {member.displayName} — {STATE_WORD[member.state]}. Change their answer
      </span>
    </button>
  )
}
