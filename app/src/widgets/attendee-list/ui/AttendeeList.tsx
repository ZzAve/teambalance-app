import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { AttendanceEntry, EventRoster, SubstituteEntry } from '@shared/api/events'
import { Avatar } from '@shared/ui/avatar'
import { AnswerSheet, type AnswerTarget } from '@features/attendance-toggle/ui/AnswerSheet'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import {
  findSomeone,
  lineupRows,
  verdictWord,
  STATE_WORD,
  UNASSIGNED,
  type LineupRow,
} from '@entities/event/lib/lineup'
import { attributionName, setByName } from '@entities/event/lib/attribution'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { SectionLabel } from '@shared/ui/SectionLabel'

interface AttendeeListProps {
  /** Everyone on the event — every position section lists all its members, whatever their answer. */
  attendees: AttendanceEntry[]
  roster: EventRoster
  /**
   * Fires with the *target* member's id — trust-based editing lets a member set a teammate's answer.
   *
   * **Omit it to render the list read-only.** There is no separate `readOnly` flag on purpose — with
   * one, "read-only but respondable" would be a state to reason about.
   */
  onRespond?: (userId: string, state: AttendanceState) => void
  /** The viewer, so their own row is marked and the sheet knows it is not a cross-member change. */
  currentUserId?: string | null
  /** An attendance write is in flight; the open control is held. */
  pending?: boolean
  /** Substitutes on the event (ADR-0033), shown in their Position group with a "Sub" tag. */
  substitutes?: SubstituteEntry[]
  /** Opens a Substitute's sheet. Omit it and their rows are read-only. */
  onOpenSubstitute?: (substituteId: string) => void
  /** Opens the Substitute picker for a short Position (#359). Omit it and no nudge is shown. */
  onFindSubstitute?: (position: { id: string; label: string }) => void
}

// A subtle wash + left accent in the answer's colour, so the list reads at a glance.
const ROW_TINT: Record<AttendanceState, string> = {
  ATTENDING: 'border-l-green bg-green/5',
  MAYBE: 'border-l-gold bg-gold/5',
  ABSENT: 'border-l-red bg-red/5',
  NOT_RESPONDED: 'border-l-border bg-transparent',
}

// Awaiting is a quiet neutral — in this list it is a fact about a teammate, not the loud
// call-to-act the viewer's own "Your response" prompt carries.
const ANSWER_PILL: Record<AttendanceState, string> = {
  ATTENDING: 'bg-green/10 text-green',
  MAYBE: 'bg-gold/20 text-gold-dark',
  ABSENT: 'bg-red/10 text-red',
  NOT_RESPONDED: 'bg-muted text-muted-foreground',
}

const TONE_TEXT = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
} as const

/**
 * The event-detail attendance list: everyone under their position, Unassigned last, tinted by their
 * answer, and any row opens the answer sheet.
 *
 * It is the unabridged half of what the event card shows. The card compresses a position into
 * overlapping chips capped at five; here there is room for the avatar, the whole name, the `set by …`
 * attribution and the role, so nothing is dropped. What the two share is the *model* and the
 * *words*: both build their rows with [lineupRows], both lead with [verdictWord] before the fraction,
 * and both open the one [AnswerSheet]. A reader who learned the card has nothing new to learn here.
 *
 * Two deliberate differences from the card, both because the jobs differ:
 *
 *   - **Rows keep roster order and sort by name inside a position, never by answer.** The card sorts
 *     by state because you are scanning it; you are *editing* here, and a row that jumps out from
 *     under your finger the moment you set it is a bug, not a feature.
 *   - **No cap.** Crowding collapses on a card because a card has ~40px to give. A page does not.
 *
 * Prop-only apart from which row's sheet is open (ADR-0017): grouping and name resolution are pure
 * helpers, and the mutation (and its Undo toast) live in the route container.
 */
export function AttendeeList({
  attendees,
  roster,
  onRespond,
  currentUserId,
  pending = false,
  substitutes = [],
  onOpenSubstitute,
  onFindSubstitute,
}: AttendeeListProps) {
  const [target, setTarget] = useState<AnswerTarget | null>(null)

  if (attendees.length === 0 && substitutes.length === 0) {
    return <p className="py-6 text-center text-small text-muted-foreground">No one</p>
  }

  const open = (attendance: AttendanceEntry, position?: string) =>
    setTarget({
      userId: attendance.userId,
      displayName: attendance.displayName,
      state: attendance.state,
      isSelf: attendance.userId === currentUserId,
      position,
    })

  const renderRow = (attendance: AttendanceEntry, position?: string, showRole = false) => (
    <AttendeeRow
      key={attendance.userId}
      attendance={attendance}
      attribution={attributionName(attendance, attendees)}
      isSelf={attendance.userId === currentUserId}
      showRole={showRole}
      onOpen={onRespond && (() => open(attendance, position))}
    />
  )

  const renderSubstitute = (sub: SubstituteEntry) => (
    <SubstituteRow
      key={sub.substituteId}
      substitute={sub}
      setBy={setByName(sub.changedBy, attendees)}
      onOpen={onOpenSubstitute && (() => onOpenSubstitute(sub.substituteId))}
    />
  )

  const sheet = onRespond && (
    <AnswerSheet target={target} onRespond={onRespond} onClose={() => setTarget(null)} pending={pending} />
  )

  // No positions at all: a flat list, with each member's own role as the subtitle.
  if (roster.positions.length === 0) {
    return (
      <div className="py-1">
        {attendees.map((a) => renderRow(a, undefined, true))}
        {substitutes.map(renderSubstitute)}
        {sheet}
      </div>
    )
  }

  return (
    <div>
      {lineupRows(attendees, roster, currentUserId, substitutes).map((row) => (
        <PositionGroup
          key={row.id}
          row={row}
          attendees={attendees}
          substitutes={substitutes}
          renderRow={renderRow}
          renderSubstitute={renderSubstitute}
          onFind={onFindSubstitute && (() => onFindSubstitute({ id: row.id, label: row.label }))}
        />
      ))}
      {sheet}
    </div>
  )
}

function PositionGroup({
  row,
  attendees,
  substitutes,
  renderRow,
  renderSubstitute,
  onFind,
}: {
  row: LineupRow
  attendees: AttendanceEntry[]
  substitutes: SubstituteEntry[]
  renderRow: (a: AttendanceEntry, position?: string, showRole?: boolean) => React.ReactNode
  renderSubstitute: (s: SubstituteEntry) => React.ReactNode
  /** Absent on a read-only list, or when the group is not short. */
  onFind?: () => void
}) {
  const verdict = verdictWord(row)
  const nudge = row.openSlots > 0 ? onFind : undefined
  const byName = [...row.members].sort((a, b) => a.displayName.localeCompare(b.displayName))

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 px-3 pb-1 pt-3">
        <SectionLabel as="h3">{row.label}</SectionLabel>
        <span className="flex items-baseline gap-1.5">
          {/* The verdict leads and the fraction is demoted — the same order the card uses. */}
          {verdict && <span className={`text-caption font-semibold ${TONE_TEXT[row.tone ?? 'short']}`}>{verdict}</span>}
          {row.required != null && (
            <span className="text-caption font-bold tabular-nums text-foreground/70">
              {`${row.attending}/${row.required}`}
            </span>
          )}
        </span>
      </div>
      {/* A targeted position nobody plays still gets its row — that gap is the point (#320 §3). The
          nudge says the same thing and offers a way to fill it, so it takes the empty line's place. */}
      {byName.length === 0 ? (
        !nudge && (
        <p className="px-3 pb-2 text-caption italic text-muted-foreground">nobody in this position yet</p>
        )
      ) : (
        byName.map((m) =>
          m.isSubstitute
            ? renderSubstitute(substitutes.find((s) => s.substituteId === m.userId)!)
            : renderRow(attendees.find((a) => a.userId === m.userId)!, row.label),
        )
      )}
      {nudge && <FindRow label={row.label} openSlots={row.openSlots} onFind={nudge} />}
    </div>
  )
}

/** "Find a Libero · 1 open": a short Position's way into the Substitute picker (#359). */
function FindRow({ label, openSlots, onFind }: { label: string; openSlots: number; onFind: () => void }) {
  const text = findSomeone(label)
  return (
    <button
      type="button"
      onClick={onFind}
      aria-label={`${text} · ${openSlots} open`}
      className="flex w-full items-center gap-3 border-l-[3px] border-l-transparent px-2.5 py-1.5 text-left text-small font-semibold text-purple-ink transition-colors hover:bg-purple/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-purple"
      >
        <Plus size={16} />
      </span>
      <span aria-hidden>
        {text} <span className="font-normal text-muted-foreground">· {openSlots} open</span>
      </span>
    </button>
  )
}

function AttendeeRow({
  attendance,
  attribution,
  isSelf,
  showRole,
  onOpen,
}: {
  attendance: AttendanceEntry
  attribution: string | null
  isSelf: boolean
  showRole: boolean
  /** Absent on a read-only list: the row becomes a fact rather than a control. */
  onOpen?: () => void
}) {
  // Attribution takes the subtitle when present; otherwise, in the flat list only, the member's own
  // position — unless it is the non-informative "Unassigned".
  const subtitle = attribution
    ? `set by ${attribution}`
    : showRole && attendance.role && attendance.role !== UNASSIGNED
      ? attendance.role
      : null

  const body = (
    <>
      <Avatar userId={attendance.userId} name={attendance.displayName} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-small leading-tight">
          {attendance.displayName}
          {isSelf && (
            <span className="ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-blue">
              You
            </span>
          )}
        </span>
        {subtitle && <span className="block text-caption text-muted-foreground">{subtitle}</span>}
      </span>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-caption font-semibold ${ANSWER_PILL[attendance.state]}`}>
        {STATE_WORD[attendance.state]}
      </span>
    </>
  )

  const shell = `flex w-full items-center gap-3 border-l-[3px] px-2.5 py-1.5 text-left ${ROW_TINT[attendance.state]}`

  // The whole row is the target, not a pill at its edge — a 44px-tall strip instead of a small chip.
  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${attendance.displayName}${isSelf ? ' (you)' : ''} — ${STATE_WORD[attendance.state]}. Change their answer`}
      className={`${shell} transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}
    >
      {body}
    </button>
  ) : (
    <div className={shell}>{body}</div>
  )
}

/**
 * A Substitute in their Position group (ADR-0033): the dashed purple avatar and the "Sub" tag set
 * them apart from Members, and "set by" always shows, since a Substitute never answers for
 * themselves.
 */
function SubstituteRow({
  substitute,
  setBy,
  onOpen,
}: {
  substitute: SubstituteEntry
  setBy: string
  onOpen?: () => void
}) {
  const body = (
    <>
      <SubstituteAvatar name={substitute.name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-small leading-tight">
          {substitute.name}
          <span className="ml-1.5 rounded-full bg-purple/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-purple-ink">
            Sub
          </span>
        </span>
        <span className="block text-caption text-muted-foreground">set by {setBy}</span>
      </span>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-caption font-semibold ${ANSWER_PILL[substitute.state]}`}>
        {STATE_WORD[substitute.state]}
      </span>
    </>
  )

  const shell = `flex w-full items-center gap-3 border-l-[3px] px-2.5 py-1.5 text-left ${ROW_TINT[substitute.state]}`

  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${substitute.name}, substitute — ${STATE_WORD[substitute.state]}. Change their answer`}
      className={`${shell} transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}
    >
      {body}
    </button>
  ) : (
    <div className={shell}>{body}</div>
  )
}
