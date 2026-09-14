import { useState } from 'react'
import { Check, HelpCircle, Plus, X } from 'lucide-react'
import { avatarInitials } from '@shared/lib/avatar'
import { coveredLine, lineupRows, STATE_WORD, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant A — "Pips". Throwaway.
 *
 * The densest reading of the brief: keep the old panel's one-line-per-position rhythm exactly, and
 * swap each anonymous slot dot for the person filling it. A whole squad still fits in the height the
 * pips used, so a list of six cards stays a list.
 *
 * The pip is an initials avatar **filled with the answer colour**, not with the member's identity
 * colour — the brief asks colour to carry state, and a pip cannot carry two colour meanings at once.
 * Identity is then the initials alone, which is the compromise this variant is making and the first
 * thing to judge: at 26px, do two letters identify a teammate, or is this just prettier dots?
 *
 * Editing is an inline strip under the row — nothing moves except the row you tapped.
 */

const PIP: Record<LineupState, string> = {
  ATTENDING: 'bg-green text-white',
  MAYBE: 'bg-gold text-white',
  NOT_RESPONDED: 'border border-dashed border-muted-foreground/50 bg-muted text-muted-foreground',
  ABSENT: 'border border-red/40 bg-red/10 text-red',
}

const COUNT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

export function VariantA({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  // One open editor across the whole panel: two rows unfolded at once turns the card into a form.
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      <ul className="flex flex-col gap-1">
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            editingId={editing}
            onToggle={(userId) => setEditing((open) => (open === userId ? null : userId))}
            onRespond={(userId, state) => {
              onRespond(userId, state)
              setEditing(null)
            }}
            pending={pending}
          />
        ))}
      </ul>
    </div>
  )
}

function Row({
  row,
  editingId,
  onToggle,
  onRespond,
  pending,
}: {
  row: LineupRow
  editingId: string | null
  onToggle: (userId: string) => void
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  const open = row.members.find((m) => m.userId === editingId)

  return (
    <li className={`rounded-xl px-1 py-1 transition-colors ${open ? 'bg-muted/40' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="w-[94px] shrink-0 pt-1">
          <span className="block truncate text-[12px] leading-tight text-foreground/80">{row.label}</span>
          <span
            className={`block text-[11px] font-bold tabular-nums ${row.tone ? COUNT_TONE[row.tone] : 'text-muted-foreground'}`}
          >
            {row.required == null ? `${row.attending} in` : `${row.attending}/${row.required}`}
            {row.surplus > 0 && <span className="ml-1 font-semibold text-green-dark">+{row.surplus}</span>}
          </span>
        </span>

        <span className="flex flex-1 flex-wrap items-center gap-1">
          {row.members.map((member) => (
            <Pip
              key={member.userId}
              member={member}
              expanded={editingId === member.userId}
              onClick={() => onToggle(member.userId)}
            />
          ))}
          {/* Requirement, still visible: one ghost per slot nobody has filled. Red when the whole
              position is empty — the row is unstaffed, not merely short. */}
          {Array.from({ length: row.openSlots }, (_, i) => (
            <span
              key={`open-${i}`}
              aria-hidden
              className={`flex size-[26px] items-center justify-center rounded-full border border-dashed ${
                row.tone === 'critical' ? 'border-red/60 text-red/60' : 'border-muted-foreground/40 text-muted-foreground/50'
              }`}
            >
              <Plus size={12} />
            </span>
          ))}
          {row.openSlots > 0 && (
            <span className="sr-only">
              {row.openSlots} more {row.label} needed
            </span>
          )}
        </span>
      </div>

      {open && <InlineEditor member={open} onRespond={onRespond} pending={pending} />}
    </li>
  )
}

function Pip({ member, expanded, onClick }: { member: LineupMember; expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      title={`${member.displayName} — ${STATE_WORD[member.state]}`}
      className={`flex size-[26px] items-center justify-center rounded-full text-[10px] font-bold ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${PIP[member.state]} ${expanded ? 'scale-110 ring-2 ring-foreground ring-offset-1' : ''} ${member.isSelf ? 'ring-1 ring-blue ring-offset-1' : ''}`}
    >
      {avatarInitials(member.displayName)}
      <span className="sr-only">
        {member.displayName} — {STATE_WORD[member.state]}. Change their answer
      </span>
    </button>
  )
}

const OPTIONS: { value: LineupState; label: string; Icon: typeof Check; active: string; idle: string }[] = [
  { value: 'ATTENDING', label: 'Going', Icon: Check, active: 'bg-green text-white border-green', idle: 'border-green/30 text-green' },
  { value: 'MAYBE', label: 'Maybe', Icon: HelpCircle, active: 'bg-gold text-white border-gold', idle: 'border-gold/30 text-gold' },
  { value: 'ABSENT', label: "Can't", Icon: X, active: 'bg-red text-white border-red', idle: 'border-red/30 text-red' },
]

function InlineEditor({
  member,
  onRespond,
  pending,
}: {
  member: LineupMember
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  return (
    <div className="mt-1.5 rounded-xl border border-dashed border-border bg-card px-2.5 py-2">
      <p className="mb-1.5 text-[11.5px] text-muted-foreground">
        {member.isSelf ? 'Your answer' : 'Changing'}{' '}
        {!member.isSelf && <span className="font-semibold text-foreground">{member.displayName}</span>}
      </p>
      <div className="flex gap-1.5">
        {OPTIONS.map(({ value, label, Icon, active, idle }) => (
          <button
            key={value}
            type="button"
            aria-pressed={member.state === value}
            disabled={pending}
            onClick={() => onRespond(member.userId, value)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-[12px] font-bold transition-colors ${member.state === value ? active : idle} ${pending ? 'opacity-60' : ''}`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
