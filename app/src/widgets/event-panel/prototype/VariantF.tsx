import { useState } from 'react'
import { Check, ChevronDown, HelpCircle, X } from 'lucide-react'
import { chaseable, gaps, lineupRows, STATE_WORD, verdictWord, type LineupMember, type LineupRow, type LineupState } from './lineup-model'
import { Face, Hole } from './Face'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant F — "Triage". Throwaway.
 *
 * The one that refuses to give every position equal space. A roster panel that lists all seven rows
 * identically is an inventory, and an inventory makes you do the reading: you scan seven fractions
 * to find the two that are a problem. This inverts it — the panel opens with a sentence naming
 * exactly what is wrong, then gives the whole of its room to the positions that are short, with the
 * people worth asking already listed and one tap from Going. Everything that is fine collapses to a
 * single quiet line at the bottom.
 *
 * So "change anybody's attendance" stops being a capability you have to go looking for and becomes
 * the panel's primary action: the buttons sit next to the gap they would close.
 *
 * The bet: on an events list you are not auditing a squad, you are answering "is this one OK, and
 * if not what do I do about it". The cost: the layout moves as answers land — a position that gets
 * covered leaves the top of the panel and joins the quiet line — which is either the whole point or
 * deeply annoying, and only using it will say which.
 */
export function VariantF({ attendances, roster, currentUserId, onRespond, pending }: LineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const open = gaps(rows)
  const settled = rows.filter((r) => !open.some((g) => g.id === r.id))
  const [showSettled, setShowSettled] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const critical = open.some((r) => r.tone === 'critical')

  return (
    <div>
      <p
        className={`font-display text-[15px] font-bold leading-snug ${critical ? 'text-red' : open.length > 0 ? 'text-gold-dark' : 'text-green-dark'}`}
      >
        {headline(open, roster.totalAttending)}
      </p>

      {open.length > 0 && (
        <div className="mt-3 flex flex-col gap-2.5">
          {open.map((row) => (
            <Gap
              key={row.id}
              row={row}
              editing={editing}
              onToggleMember={(userId) => setEditing((id) => (id === userId ? null : userId))}
              onRespond={(userId, state) => {
                onRespond(userId, state)
                setEditing(null)
              }}
              pending={pending}
            />
          ))}
        </div>
      )}

      {settled.length > 0 && (
        <div className="mt-3 border-t border-dashed border-border pt-2">
          <button
            type="button"
            aria-expanded={showSettled}
            onClick={() => setShowSettled((s) => !s)}
            className="flex w-full items-center gap-1.5 text-left"
          >
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-muted-foreground">
              {settled.map((r) => r.label).join(' · ')}
            </span>
            <span className="shrink-0 text-[11.5px] font-semibold text-green-dark">
              {open.length > 0 ? 'sorted' : 'all sorted'}
            </span>
            <ChevronDown
              size={13}
              aria-hidden
              className={`shrink-0 text-muted-foreground transition-transform ${showSettled ? 'rotate-180' : ''}`}
            />
          </button>

          {showSettled && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {settled.map((row) => (
                <li key={row.id} className="flex items-center gap-2.5">
                  <span className="w-[86px] shrink-0 truncate text-[12px] text-foreground/80">{row.label}</span>
                  <span className="flex flex-1">
                    {row.members
                      .filter((m) => m.state === 'ATTENDING')
                      .map((m) => (
                        <Face key={m.userId} member={m} size={22} stacked />
                      ))}
                  </span>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-muted-foreground">
                    {row.required == null ? `${row.attending}` : `${row.attending}/${row.required}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

/** The sentence the panel opens with. Names the positions while naming them is still useful. */
function headline(open: LineupRow[], totalAttending: number): string {
  if (open.length === 0) return `Lineup set — ${totalAttending} going.`
  if (open.length > 2) return `${open.length} positions still need people.`
  const phrase = (row: LineupRow) =>
    row.attending === 0 ? `No ${row.label} yet` : `${row.label} needs ${row.openSlots} more`
  return open.map(phrase).join(', and ') + '.'
}

function Gap({
  row,
  editing,
  onToggleMember,
  onRespond,
  pending,
}: {
  row: LineupRow
  editing: string | null
  onToggleMember: (userId: string) => void
  onRespond: (userId: string, state: LineupState) => void
  pending?: boolean
}) {
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const ask = chaseable(row)

  return (
    <div
      className={`rounded-xl border p-2.5 ${row.tone === 'critical' ? 'border-red/35 bg-red/5' : 'border-gold/40 bg-gold/8'}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display truncate text-[13.5px] font-bold">{row.label}</span>
        <span
          className={`shrink-0 text-[11.5px] font-bold tabular-nums ${row.tone === 'critical' ? 'text-red' : 'text-gold-dark'}`}
        >
          {row.attending}/{row.required} · {verdictWord(row)}
        </span>
      </div>

      {/* Who is already in, and the holes beside them at the same size — the gap is a shape here,
          not a number you have to subtract. */}
      <div className="mt-1.5 flex items-center">
        {going.map((m) => (
          <Face key={m.userId} member={m} size={26} stacked />
        ))}
        {Array.from({ length: row.openSlots }, (_, i) => (
          <Hole key={i} size={26} critical={row.tone === 'critical'} />
        ))}
      </div>

      {ask.length > 0 ? (
        <>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">Worth asking</p>
          <ul className="mt-1 flex flex-col gap-1">
            {ask.map((m) => (
              <li key={m.userId}>
                <div className="flex items-center gap-2">
                  <Face member={m} size={24} selected={editing === m.userId} />
                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    {m.displayName}
                    <span className={`ml-1.5 text-[11px] font-semibold ${STATE_TEXT[m.state]}`}>
                      {STATE_WORD[m.state].toLowerCase()}
                    </span>
                  </span>
                  {/* The one-tap close for this gap. ADR-0003 lets a member answer for a teammate;
                      here that is the point of the row rather than a power buried two taps deep. */}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onRespond(m.userId, 'ATTENDING')}
                    className={`shrink-0 rounded-full bg-green px-2.5 py-1 text-[11.5px] font-bold text-white ${pending ? 'opacity-60' : ''}`}
                  >
                    Going
                  </button>
                  <button
                    type="button"
                    aria-expanded={editing === m.userId}
                    onClick={() => onToggleMember(m.userId)}
                    className="shrink-0 rounded-full px-1 py-1 text-muted-foreground"
                  >
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className={`transition-transform ${editing === m.userId ? 'rotate-180' : ''}`}
                    />
                    <span className="sr-only">Other answers for {m.displayName}</span>
                  </button>
                </div>
                {editing === m.userId && <Picker member={m} onRespond={onRespond} pending={pending} />}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-[12px] text-muted-foreground">
          Everyone who plays {row.label} is already going — this one needs a new body, not a nudge.
        </p>
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
    <div className="flex gap-1.5 py-1.5 pl-8" role="group" aria-label={`${member.displayName}'s answer`}>
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
