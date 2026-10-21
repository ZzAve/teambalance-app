import { useState } from 'react'
import { Check, HelpCircle, Plus, X } from 'lucide-react'
import type { AttendanceEntry, EventRoster, SubstituteEntry } from '@shared/api/events'
import { Avatar } from '@shared/ui/avatar'
import { teamPhotoUrl } from '@shared/api/photos'
import { AnswerSheet, type AnswerTarget } from '@features/attendance-toggle/ui/AnswerSheet'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import {
  findSomeone,
  lineupRows,
  verdictWord,
  UNASSIGNED,
  type LineupRow,
  type PositionRef,
} from '@entities/event/lib/lineup'
import { attributionName, setByName } from '@entities/event/lib/attribution'
import { ATTENDANCE_WORDS } from '@entities/event/lib/attendance-words'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { VERDICT_TONE } from '@entities/event/ui/verdict-tone'
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
  onFindSubstitute?: (position: PositionRef) => void
  /** The team's position labels in its own order, so the sections never reorder (see `lineupRows`). */
  positionOrder?: string[]
}

// The chip's border and wash in the answer's colour, so the list reads at a glance. Not responded is
// a quiet neutral — here it is a fact about a teammate, not the viewer's own call to act.
const CHIP_TONE: Record<AttendanceState, string> = {
  ATTENDING: 'border-green/45 bg-green/10',
  MAYBE: 'border-gold/55 bg-gold/15',
  ABSENT: 'border-red/35 bg-red/5',
  NOT_RESPONDED: 'border-border bg-card',
}

// The answer as a shape too, so it never rests on colour alone (WCAG 1.4.1). No answer has no mark.
const STATE_MARK: Record<AttendanceState, React.ReactNode> = {
  ATTENDING: <Check size={16} className="text-green-dark" />,
  MAYBE: <HelpCircle size={16} className="text-gold-ink" />,
  ABSENT: <X size={16} className="text-red" />,
  NOT_RESPONDED: null,
}

const CHIP =
  'flex min-h-11 max-w-full items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-left transition-colors'
const CHIP_CONTROL = 'hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * The event-detail attendance list: everyone under their position as a chip, Unassigned last, tinted
 * by their answer, and any chip opens the answer sheet.
 *
 * It is the unabridged half of what the event card shows. The card compresses a position into
 * overlapping chips capped at five; here the chips stand apart, with room for the avatar, the
 * `set by …` attribution and the role, so nothing is dropped. What the two share is the *model* and the
 * *words*: both build their rows with [lineupRows], both lead with [verdictWord] before the fraction,
 * and both open the one [AnswerSheet]. A reader who learned the card has nothing new to learn here.
 *
 * Both keep roster order and sort by name inside a position, never by answer (see `lineupRows`).
 * One deliberate difference from the card: **no cap.** Crowding collapses on a card because a card
 * has ~40px to give. A page does not.
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
  positionOrder,
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

  const renderRow = (attendance: AttendanceEntry, position?: string, showRole = false, name?: string) => (
    <AttendeeRow
      key={attendance.userId}
      attendance={attendance}
      name={name ?? attendance.displayName}
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

  const rows = lineupRows(attendees, roster, currentUserId, substitutes, positionOrder)

  // An untracked event (a social), or nobody with a position: a flat list in name order, members then
  // substitutes, with each member's own role as the subtitle. Decided by the event, not by who is
  // going, so the layout does not switch when an answer changes.
  if (!roster.trackRoster || rows.every((r) => r.id === 'unassigned')) {
    return (
      <div className="flex flex-wrap gap-2 p-3">
        {[...attendees].sort((a, b) => a.displayName.localeCompare(b.displayName)).map((a) => renderRow(a, undefined, true))}
        {[...substitutes].sort((a, b) => a.name.localeCompare(b.name)).map(renderSubstitute)}
        {sheet}
      </div>
    )
  }

  return (
    <div className="space-y-2 p-2">
      {rows.map((row) => (
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
  renderRow: (a: AttendanceEntry, position?: string, showRole?: boolean, name?: string) => React.ReactNode
  renderSubstitute: (s: SubstituteEntry) => React.ReactNode
  /** Absent on a read-only list, or when the group is not short. */
  onFind?: () => void
}) {
  const verdict = verdictWord(row)
  const nudge = row.openSlots > 0 ? onFind : undefined

  // A light box per position, so the heading, its verdict and its people read as one group.
  return (
    <section aria-label={row.label} className="rounded-md bg-muted/40">
      <div className="flex items-baseline justify-between gap-3 px-3 pb-1 pt-2.5">
        <SectionLabel as="h3">{row.label}</SectionLabel>
        <span className="flex items-baseline gap-1.5">
          {/* The verdict leads and the fraction is demoted — the same order the card uses. */}
          {verdict && <span className={`text-caption font-semibold ${VERDICT_TONE[row.tone ?? 'short']}`}>{verdict}</span>}
          {row.required != null && (
            <span className="text-caption font-bold tabular-nums text-foreground/70">
              {`${row.attending}/${row.required}`}
            </span>
          )}
        </span>
      </div>
      {/* A targeted position nobody plays still gets its row — that gap is the point (#320 §3). The
          open slots sit in the run, after the people, as on the event card; only an untargeted empty
          position needs words. */}
      {row.members.length === 0 && !nudge ? (
        <p className="px-3 pb-2.5 text-caption italic text-muted-foreground">nobody in this position yet</p>
      ) : (
        <div className="flex flex-wrap gap-2 px-3 pb-3 pt-1">
          {row.members.map((m) =>
            m.isSubstitute
              ? renderSubstitute(substitutes.find((s) => s.substituteId === m.userId)!)
              : renderRow(attendees.find((a) => a.userId === m.userId)!, row.label, false, m.chipName),
          )}
          {nudge && <OpenSlots label={row.label} openSlots={row.openSlots} onFind={nudge} />}
        </div>
      )}
    </section>
  )
}

/**
 * A short Position's open slots, one dashed "+" per slot at chip height, in the run after its people,
 * as the event card does it. One button for all of them: tapping opens the Substitute picker (#359).
 */
function OpenSlots({ label, openSlots, onFind }: { label: string; openSlots: number; onFind: () => void }) {
  return (
    <button
      type="button"
      onClick={onFind}
      aria-label={`${findSomeone(label)} · ${openSlots} open`}
      className="flex flex-wrap gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {Array.from({ length: openSlots }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="grid size-11 place-items-center rounded-full border-[1.5px] border-dashed border-purple text-purple-ink hover:bg-purple/5"
        >
          <Plus size={18} />
        </span>
      ))}
    </button>
  )
}

function AttendeeRow({
  attendance,
  name,
  attribution,
  isSelf,
  showRole,
  onOpen,
}: {
  attendance: AttendanceEntry
  /** The chip's name: the first name in a position group, the whole name in the flat list. */
  name: string
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
      <Avatar
        userId={attendance.userId}
        name={attendance.displayName}
        photoUrl={attendance.photoVersion ? teamPhotoUrl(attendance.userId, attendance.photoVersion) : undefined}
      />
      <span className="min-w-0">
        <span className="block truncate text-small font-semibold leading-tight">
          {name}
          {isSelf && (
            <span className="ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-blue">
              You
            </span>
          )}
        </span>
        {subtitle && <span className="block truncate text-caption leading-tight text-muted-foreground">{subtitle}</span>}
      </span>
      <span aria-hidden className="shrink-0">{STATE_MARK[attendance.state]}</span>
      <span className="sr-only">{ATTENDANCE_WORDS[attendance.state].word}</span>
    </>
  )

  const shell = `${CHIP} ${CHIP_TONE[attendance.state]}`

  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${attendance.displayName}${isSelf ? ' (you)' : ''} — ${ATTENDANCE_WORDS[attendance.state].word}. Change their answer`}
      className={`${shell} ${CHIP_CONTROL}`}
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
      <span className="min-w-0">
        <span className="block truncate text-small font-semibold leading-tight">
          {substitute.name}
          <span className="ml-1.5 rounded-full bg-purple/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-purple-ink">
            Sub
          </span>
        </span>
        <span className="block truncate text-caption leading-tight text-muted-foreground">set by {setBy}</span>
      </span>
      <span aria-hidden className="shrink-0">{STATE_MARK[substitute.state]}</span>
      <span className="sr-only">{ATTENDANCE_WORDS[substitute.state].word}</span>
    </>
  )

  const shell = `${CHIP} ${CHIP_TONE[substitute.state]}`

  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${substitute.name}, substitute — ${ATTENDANCE_WORDS[substitute.state].word}. Change their answer`}
      className={`${shell} ${CHIP_CONTROL}`}
    >
      {body}
    </button>
  ) : (
    <div className={shell}>{body}</div>
  )
}
