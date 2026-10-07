import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import type { AttendanceEntry, EventRoster, SubstituteEntry } from '@shared/api/events'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { AnswerSheet } from '@features/attendance-toggle/ui/AnswerSheet'
import { SubstituteSheet } from '@features/call-in-substitutes/ui/SubstituteSheet'
import type { SubstituteState } from '@features/call-in-substitutes/ui/SubstitutesBlock'
import { setByName } from '@entities/event/lib/attribution'
import { MemberChip, OverflowChip, OpenSlotChip } from '@entities/event/ui/MemberChip'
import { headcountLine, staffNote } from '@entities/event/lib/roster-view'
import { VERDICT_TONE } from '@entities/event/ui/verdict-tone'
import {
  coveredLine,
  lineupRows,
  substituteLine,
  verdictWord,
  type LineupMember,
  type PositionRef,
  type LineupRow,
  type LineupState,
} from '@entities/event/lib/lineup'

/**
 * What an event card's roster disclosure opens onto: a row per position, the people who play it as
 * overlapping name chips, and every answer editable from here.
 *
 * It replaces the either/or this panel used to offer — anonymous slot pips *or* a flat member list,
 * chosen once in the page header. Neither answered the question a captain actually has ("which
 * position is short, and who do I chase for it"), because one knew the targets and the other knew
 * the people. This is both: the slots *are* the people.
 *
 * Three things the layout is doing deliberately:
 *
 *   - **The verdict is a word, the fraction is demoted.** "nobody yet" and "needs 1 more" land
 *     before "0/1" does; the number sits at the right edge for when the word made you want it.
 *   - **Three clusters, not one sorted run.** Who is in, then the gaps, then everyone else, with
 *     real air between them — so "who is actually playing" is one shape rather than a prefix.
 *   - **Crowding collapses, it does not shrink.** A cluster caps at [CAP] and hands the rest to a
 *     counter, which is what lets a chip refuse to clip a name (see MemberChip).
 *
 * Prop-only (ADR-0017). `attendances` already carries any optimistic answer from the route, and
 * `onRespond` fires the write — so every state here is reachable from a story, and the mutation and
 * its rollback stay in the container. `onRespond` takes the *target* member's id: a member may set a
 * teammate's answer (ADR-0003), and the sheet says whose answer is being changed.
 */

/** Five, following the avatar groups this borrows from — Atlassian caps at four, Emplifi at five. */
const CAP = 5

interface EventLineupPanelProps {
  /** Every current member, non-responders included — the list payload already carries them. */
  attendances: AttendanceEntry[]
  roster: EventRoster
  /** The viewer, so their own chip is marked and never squeezed out of a crowded row. */
  currentUserId?: string | null
  /** Substitutes on the event (ADR-0033), shown in their Position row with a "Sub" tag. */
  substitutes?: SubstituteEntry[]
  onRespond: (userId: string, state: LineupState) => void
  /** Opens the Substitute picker, for one Position when it comes from that Position's open spot. */
  onCallInSubstitutes: (position: PositionRef | null) => void
  /** Any Member changing a Substitute's state on this event, from their sheet (ADR-0033). */
  onSetSubstituteState: (substituteId: string, state: SubstituteState) => void
  /** Takes a Substitute off this event; they stay on the Team's list. */
  onTakeOffSubstitute: (substituteId: string) => void
  /** An attendance write is in flight; the answer control is held. */
  pending?: boolean
  /** A Substitute write is in flight; the Substitute sheet is held. */
  substitutePending?: boolean
}

export function EventLineupPanel({
  attendances,
  roster,
  currentUserId,
  substitutes = [],
  onRespond,
  onCallInSubstitutes,
  onSetSubstituteState,
  onTakeOffSubstitute,
  pending,
  substitutePending,
}: EventLineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId, substitutes)
  const [answeringFor, setAnsweringFor] = useState<string | null>(null)
  const [openSubstituteId, setOpenSubstituteId] = useState<string | null>(null)
  // Which clusters the viewer unfolded, keyed `rowId:group`. Expanding one leaves the rest collapsed
  // — the point of the cap is that a long row stays short unless you ask it not to.
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())

  // Members only, whichever path set `answeringFor`: the answer sheet writes Member attendance.
  const member = rows.flatMap((r) => r.members).find((m) => !m.isSubstitute && m.userId === answeringFor) ?? null
  const memberRow = rows.find((r) => r.members.some((m) => !m.isSubstitute && m.userId === answeringFor))
  const openSubstitute = substitutes.find((s) => s.substituteId === openSubstituteId) ?? null

  // A chip routes by who it is: the answer sheet writes Member attendance, so a Substitute's id must
  // never reach it (ADR-0033); their own sheet sets their state instead.
  const select = (m: LineupMember) => (m.isSubstitute ? setOpenSubstituteId : setAnsweringFor)(m.userId)

  const toggleCluster = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (!next.delete(key)) next.add(key)
      return next
    })

  // What the header states depends on what the team actually targeted: covered positions where
  // there are position targets, the headcount where only a total is set, a plain count otherwise.
  const covered = coveredLine(rows)
  const headcount = headcountLine(roster)
  const summary = covered ?? headcount ?? `${roster.totalAttending} going`
  const subs = substituteLine(rows)
  const staff = staffNote(roster)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <SectionLabel as="span">Lineup</SectionLabel>
        <span className="text-caption font-bold text-foreground/70">
          <span>{summary}</span>
          {subs && (
            <>
              {' · '}
              <span className="text-purple-ink">{subs}</span>
            </>
          )}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-small text-muted-foreground">Nobody has answered yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {rows.map((row) => (
            <PositionRow
              key={row.id}
              row={row}
              expanded={expanded}
              onToggleCluster={toggleCluster}
              onSelect={select}
              onFind={() => onCallInSubstitutes({ id: row.id, label: row.label })}
            />
          ))}
        </div>
      )}

      {/* Why the fraction above can be smaller than the number of people in the room (#281). */}
      {covered && headcount && <p className="mt-3 text-caption text-muted-foreground">{headcount}</p>}
      {staff && <p className="mt-2 text-caption text-muted-foreground">{staff}</p>}

      <button
        type="button"
        onClick={() => onCallInSubstitutes(null)}
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-purple/55 min-h-11 py-2 text-small font-semibold text-purple-ink hover:bg-purple/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UserPlus size={18} aria-hidden />
        Call in substitutes
      </button>

      {/* One answer control app-wide — the detail page's attendee list opens this same sheet. */}
      <AnswerSheet
        target={member && { ...member, position: memberRow?.label }}
        pending={pending}
        onRespond={onRespond}
        onClose={() => setAnsweringFor(null)}
      />
      {/* The same sheet the event page opens for a Substitute. */}
      <SubstituteSheet
        substitute={openSubstitute}
        setBy={openSubstitute && setByName(openSubstitute.changedBy, attendances)}
        onSetState={onSetSubstituteState}
        onTakeOff={onTakeOffSubstitute}
        onClose={() => setOpenSubstituteId(null)}
        pending={substitutePending}
      />
    </div>
  )
}

function PositionRow({
  row,
  expanded,
  onToggleCluster,
  onSelect,
  onFind,
}: {
  row: LineupRow
  expanded: ReadonlySet<string>
  onToggleCluster: (key: string) => void
  onSelect: (member: LineupMember) => void
  onFind: () => void
}) {
  const verdict = verdictWord(row)
  const going = row.members.filter((m) => m.state === 'ATTENDING')
  const maybe = row.members.filter((m) => m.state === 'MAYBE')
  const out = row.members.filter((m) => m.state === 'NOT_RESPONDED' || m.state === 'ABSENT')

  const cluster = (group: string, members: LineupMember[], label: string) => (
    <Cluster
      members={members}
      label={label}
      expanded={expanded.has(`${row.id}:${group}`)}
      onToggle={() => onToggleCluster(`${row.id}:${group}`)}
      onSelect={onSelect}
    />
  )

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display truncate text-small font-bold leading-none">{row.label}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          {verdict && (
            <span className={`text-caption font-semibold ${VERDICT_TONE[row.tone ?? 'short']}`}>{verdict}</span>
          )}
          <span className="text-caption font-bold tabular-nums text-muted-foreground">
            {row.required == null ? row.attending : `${row.attending}/${row.required}`}
          </span>
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {going.length > 0 && cluster('in', going, 'going')}
        {row.openSlots > 0 && <OpenSlotChip positionLabel={row.label} openSlots={row.openSlots} onFind={onFind} />}
        {maybe.length > 0 && cluster('maybe', maybe, 'maybe')}
        {out.length > 0 && <span className="opacity-70">{cluster('out', out, 'out')}</span>}
        {row.members.length === 0 && row.openSlots === 0 && (
          <span className="text-caption text-muted-foreground">Nobody yet</span>
        )}
      </div>
    </div>
  )
}

/**
 * One cluster of chips. Wraps rather than clipping, and shows `CAP` before collapsing the rest —
 * `CAP - 1` plus the counter once it does, so adding the counter never makes the row grow.
 */
function Cluster({
  members,
  label,
  expanded,
  onToggle,
  onSelect,
}: {
  members: LineupMember[]
  label: string
  expanded: boolean
  onToggle: () => void
  onSelect: (member: LineupMember) => void
}) {
  const overflows = members.length > CAP
  const shown = expanded || !overflows ? members : members.slice(0, CAP - 1)
  const hidden = members.length - shown.length

  return (
    <span className="flex max-w-full flex-wrap items-center">
      {shown.map((m) => (
        <MemberChip key={m.userId} member={m} onSelect={() => onSelect(m)} />
      ))}
      {(hidden > 0 || expanded) && overflows && (
        <OverflowChip hidden={hidden} expanded={expanded} label={label} onToggle={onToggle} />
      )}
    </span>
  )
}
