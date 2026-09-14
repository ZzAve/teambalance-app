import { useState } from 'react'
import { Check, HelpCircle, X } from 'lucide-react'
import { coveredLine, lineupRows, STATE_WORD, verdictWord, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import { Face, Hole } from './Face'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant D — "Huddle". Throwaway.
 *
 * Round two, answering the verdict on round one: pips and pills read as a spreadsheet, not a squad.
 *
 * Two changes carry it. The people **overlap** — a position's going players are one huddle of faces,
 * not a row of separate cells, so fifteen of them cost the width of six and the group reads as a
 * group. And the row's headline is a **word**, not a fraction: "nobody yet", "needs 1 more",
 * "1 spare". The numbers are still there, demoted to the right edge where you look only when the
 * word made you want them.
 *
 * Faces keep their own identity colour with the answer as a ring (see `Face`), so a teammate looks
 * like themselves here and on the team page — the thing state-coloured pips gave up.
 *
 * Tapping a huddle fans it out into names; tapping a name changes their answer.
 */
export function VariantD({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <Huddle
            key={row.id}
            row={row}
            open={openRow === row.id}
            editing={editing}
            onToggleRow={() => {
              setOpenRow((id) => (id === row.id ? null : row.id))
              setEditing(null)
            }}
            onToggleMember={(userId) => setEditing((id) => (id === userId ? null : userId))}
            onRespond={(userId, state) => {
              onRespond(userId, state)
              setEditing(null)
            }}
            pending={pending}
          />
        ))}
      </div>
    </div>
  )
}

const VERDICT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

function Huddle({
  row,
  open,
  editing,
  onToggleRow,
  onToggleMember,
  onRespond,
  pending,
}: {
  row: LineupRow
  open: boolean
  editing: string | null
  onToggleRow: () => void
  onToggleMember: (userId: string) => void
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  const verdict = verdictWord(row)
  // Three clusters with real air between them, so "who is in" is one shape rather than a sorted run:
  // the lineup, the maybes, then the people who are out.
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const maybe = row.members.filter((m) => m.state === 'MAYBE')
  const out = row.members.filter((m) => m.state === 'NOT_RESPONDED' || m.state === 'ABSENT')

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggleRow}
        className="flex w-full items-baseline justify-between gap-2 text-left"
      >
        <span className="font-display truncate text-[14px] font-bold leading-none">{row.label}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          {verdict && (
            <span className={`text-[12px] font-semibold ${VERDICT_TONE[row.tone ?? 'short']}`}>{verdict}</span>
          )}
          <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
            {row.required == null ? `${row.attending}` : `${row.attending}/${row.required}`}
          </span>
        </span>
      </button>

      <button
        type="button"
        aria-expanded={open}
        onClick={onToggleRow}
        className="mt-2 flex w-full flex-wrap items-center gap-x-4 gap-y-2 py-0.5"
      >
        {going.length > 0 && (
          <span className="flex">
            {going.map((m) => (
              <Face key={m.userId} member={m} stacked />
            ))}
          </span>
        )}
        {row.openSlots > 0 && (
          <span className="flex">
            {Array.from({ length: row.openSlots }, (_, i) => (
              <Hole key={i} critical={row.tone === 'critical'} />
            ))}
          </span>
        )}
        {maybe.length > 0 && (
          <span className="flex">
            {maybe.map((m) => (
              <Face key={m.userId} member={m} stacked />
            ))}
          </span>
        )}
        {out.length > 0 && (
          <span className="flex">
            {out.map((m) => (
              <Face key={m.userId} member={m} size={26} stacked />
            ))}
          </span>
        )}
        <span className="sr-only">{open ? `Hide ${row.label} names` : `Show ${row.label} names`}</span>
      </button>

      {open && (
        <ul className="mt-2 flex flex-col gap-0.5 rounded-xl bg-muted/45 p-1.5">
          {row.members.map((m) => (
            <li key={m.userId}>
              <button
                type="button"
                aria-expanded={editing === m.userId}
                onClick={() => onToggleMember(m.userId)}
                className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left"
              >
                <Face member={m} size={24} selected={editing === m.userId} />
                <span className="min-w-0 flex-1 truncate text-[13px]">
                  {m.displayName}
                  {m.isSelf && <span className="ml-1.5 text-[10px] font-bold text-blue">you</span>}
                </span>
                <span className={`shrink-0 text-[11px] font-semibold ${STATE_TEXT[m.state]}`}>
                  {STATE_WORD[m.state]}
                </span>
              </button>
              {editing === m.userId && <Picker member={m} onRespond={onRespond} pending={pending} />}
            </li>
          ))}
          {row.members.length === 0 && (
            <li className="px-1.5 py-2 text-[12.5px] text-muted-foreground">Nobody plays {row.label} yet.</li>
          )}
        </ul>
      )}
    </div>
  )
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
    <div className="flex gap-1.5 px-1.5 pb-1.5 pt-1" role="group" aria-label={`${member.displayName}'s answer`}>
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
