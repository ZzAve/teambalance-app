import { useState } from 'react'
import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import { Avatar } from '@shared/ui/avatar'
import { AnswerSheet, type AnswerTarget } from '@features/attendance-toggle/ui/AnswerSheet'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { lineupRows, verdictWord, STATE_WORD, UNASSIGNED, type LineupRow } from '@entities/event/lib/lineup'
import { attributionName } from '@entities/event/lib/attribution'
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
export function AttendeeList({ attendees, roster, onRespond, currentUserId, pending = false }: AttendeeListProps) {
  const [target, setTarget] = useState<AnswerTarget | null>(null)

  if (attendees.length === 0) {
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

  const sheet = onRespond && (
    <AnswerSheet target={target} onRespond={onRespond} onClose={() => setTarget(null)} pending={pending} />
  )

  // No positions at all: a flat list, with each member's own role as the subtitle.
  if (roster.positions.length === 0) {
    return (
      <div className="py-1">
        {attendees.map((a) => renderRow(a, undefined, true))}
        {sheet}
      </div>
    )
  }

  return (
    <div>
      {lineupRows(attendees, roster, currentUserId).map((row) => (
        <PositionGroup key={row.id} row={row} attendees={attendees} renderRow={renderRow} />
      ))}
      {sheet}
    </div>
  )
}

function PositionGroup({
  row,
  attendees,
  renderRow,
}: {
  row: LineupRow
  attendees: AttendanceEntry[]
  renderRow: (a: AttendanceEntry, position?: string, showRole?: boolean) => React.ReactNode
}) {
  const verdict = verdictWord(row)
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
      {/* A targeted position nobody plays still gets its row — that gap is the point (#320 §3). */}
      {byName.length === 0 ? (
        <p className="px-3 pb-2 text-caption italic text-muted-foreground">nobody in this position yet</p>
      ) : (
        byName.map((m) => renderRow(attendees.find((a) => a.userId === m.userId)!, row.label))
      )}
    </div>
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
