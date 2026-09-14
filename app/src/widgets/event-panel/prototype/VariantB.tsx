import { Fragment, useState } from 'react'
import { Check, HelpCircle, X } from 'lucide-react'
import { coveredLine, lineupRows, STATE_WORD, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant B — "Pills". Throwaway.
 *
 * The opposite bet to A: spend the vertical space and print the names. Each position is a block, not
 * a line — a heading carrying the requirement as a slot meter, then the squad as wrapped name pills
 * tinted by answer. Nobody has to decode two letters, and "who is actually coming" is readable at
 * arm's length, which is what a card in a list is read at.
 *
 * The cost is height: this is roughly three times variant A per event, so the question it asks is
 * whether an events *list* can afford it, or whether this only works as the detail page.
 *
 * Editing morphs the pill **in place** into a three-way control — the row reflows around one pill
 * rather than pushing a panel under the whole block.
 */

const PILL: Record<LineupState, string> = {
  ATTENDING: 'bg-green/12 text-green-dark border-green/30',
  MAYBE: 'bg-gold/20 text-gold-dark border-gold/40',
  NOT_RESPONDED: 'bg-muted text-muted-foreground border-transparent',
  ABSENT: 'bg-red/10 text-red border-red/25 line-through decoration-red/40',
}

const DOT: Record<LineupState, string> = {
  ATTENDING: 'bg-green',
  MAYBE: 'bg-gold',
  NOT_RESPONDED: 'bg-muted-foreground/40',
  ABSENT: 'bg-red',
}

const HEADING_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

export function VariantB({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const covered = coveredLine(rows)
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        {covered && <span className="text-[11px] font-bold text-foreground/70">{covered}</span>}
      </div>

      {rows.map((row) => (
        <Block
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
    </div>
  )
}

function Block({
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
  // Whoever is last in the "going or maybe" run — the pill the hole gets parked behind.
  const lastIn = [...row.members].reverse().find((m) => m.state === 'ATTENDING' || m.state === 'MAYBE')

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-foreground/70">{row.label}</span>
        {row.isStaff && (
          <span className="rounded-full bg-muted px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide text-muted-foreground">
            staff
          </span>
        )}
        <span className="h-px flex-1 bg-border/60" />
        {/* The requirement, as a meter rather than a fraction: one segment per slot the team asked
            for, filled left to right. The number stays beside it — a meter alone is not a label. */}
        {row.required != null && (
          <span className="flex items-center gap-1.5">
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: row.required }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-3 rounded-full ${i < row.attending ? 'bg-green' : row.tone === 'critical' ? 'bg-red/30' : 'bg-muted-foreground/25'}`}
                />
              ))}
            </span>
            <span className={`text-[11px] font-bold tabular-nums ${HEADING_TONE[row.tone ?? 'short']}`}>
              {row.attending}/{row.required}
              {row.surplus > 0 && <span className="ml-0.5 text-green-dark">+{row.surplus}</span>}
            </span>
          </span>
        )}
        {row.required == null && (
          <span className="text-[11px] font-bold tabular-nums text-muted-foreground">{row.attending} in</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {/* Nobody is in at all, so the hole leads: the row's news is the gap, not the apologies. */}
        {!lastIn && row.openSlots > 0 && <NeedPill row={row} />}
        {row.members.map((member) => (
          <Fragment key={member.userId}>
            {editingId === member.userId ? (
              <InlinePicker member={member} onRespond={onRespond} pending={pending} />
            ) : (
              <Pill member={member} onClick={() => onToggle(member.userId)} />
            )}
            {/* The hole sits against the run of people who are in, not at the tail after the noes. */}
            {member.userId === lastIn?.userId && row.openSlots > 0 && <NeedPill row={row} />}
          </Fragment>
        ))}
        {row.members.length === 0 && row.openSlots === 0 && (
          <span className="text-[12px] text-muted-foreground">Nobody yet</span>
        )}
      </div>
    </div>
  )
}

function NeedPill({ row }: { row: LineupRow }) {
  return (
    <span
      className={`rounded-full border border-dashed px-2.5 py-1 text-[12px] font-semibold ${
        row.tone === 'critical' ? 'border-red/50 text-red' : 'border-muted-foreground/40 text-muted-foreground'
      }`}
    >
      {row.openSlots} more needed
    </span>
  )
}

function Pill({ member, onClick }: { member: LineupMember; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${PILL[member.state]}`}
    >
      <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${DOT[member.state]}`} />
      {member.displayName}
      {member.isSelf && <span className="text-[10px] font-bold text-blue">you</span>}
      <span className="sr-only">
        — {STATE_WORD[member.state]}. Change their answer
      </span>
    </button>
  )
}

const OPTIONS: { value: LineupState; label: string; Icon: typeof Check; on: string; off: string }[] = [
  { value: 'ATTENDING', label: 'Going', Icon: Check, on: 'bg-green text-white', off: 'text-green hover:bg-green/10' },
  { value: 'MAYBE', label: 'Maybe', Icon: HelpCircle, on: 'bg-gold text-white', off: 'text-gold-dark hover:bg-gold/10' },
  { value: 'ABSENT', label: "Can't", Icon: X, on: 'bg-red text-white', off: 'text-red hover:bg-red/10' },
]

/** The pill, opened where it stands: same shape, same place, three targets instead of one. */
function InlinePicker({
  member,
  onRespond,
  pending,
}: {
  member: LineupMember
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  return (
    <span
      role="group"
      aria-label={`${member.displayName}'s answer`}
      className="flex items-center gap-0.5 rounded-full border border-foreground/60 bg-card py-0.5 pl-2.5 pr-0.5 text-[12px] font-semibold shadow-sm"
    >
      <span className="mr-0.5 max-w-[9rem] truncate">{member.displayName}</span>
      {OPTIONS.map(({ value, label, Icon, on, off }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={member.state === value}
          disabled={pending}
          onClick={() => onRespond(member.userId, value)}
          className={`flex size-6 items-center justify-center rounded-full transition-colors ${member.state === value ? on : off} ${pending ? 'opacity-60' : ''}`}
        >
          <Icon size={13} />
        </button>
      ))}
    </span>
  )
}
