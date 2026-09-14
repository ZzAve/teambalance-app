import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@shared/ui/sheet'
import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import { MemberChip, OverflowChip, OpenSlotChip } from '@entities/event/ui/MemberChip'
import { headcountLine, staffNote } from '@entities/event/lib/roster-view'
import {
  coveredLine,
  lineupRows,
  verdictWord,
  STATE_WORD,
  type LineupMember,
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

const VERDICT_TONE = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
} as const

interface EventLineupPanelProps {
  /** Every current member, non-responders included — the list payload already carries them. */
  attendances: AttendanceEntry[]
  roster: EventRoster
  /** The viewer, so their own chip is marked and never squeezed out of a crowded row. */
  currentUserId?: string | null
  onRespond: (userId: string, state: LineupState) => void
  /** An attendance write is in flight; the answer control is held. */
  pending?: boolean
}

export function EventLineupPanel({
  attendances,
  roster,
  currentUserId,
  onRespond,
  pending,
}: EventLineupPanelProps) {
  const rows = lineupRows(attendances, roster, currentUserId)
  const [answeringFor, setAnsweringFor] = useState<string | null>(null)
  // Which clusters the viewer unfolded, keyed `rowId:group`. Expanding one leaves the rest collapsed
  // — the point of the cap is that a long row stays short unless you ask it not to.
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())

  const member = rows.flatMap((r) => r.members).find((m) => m.userId === answeringFor) ?? null
  const memberRow = rows.find((r) => r.members.some((m) => m.userId === answeringFor))

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
  const staff = staffNote(roster)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Lineup</span>
        <span className="text-[11px] font-bold text-foreground/70">{summary}</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-[12.5px] text-muted-foreground">Nobody has answered yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {rows.map((row) => (
            <PositionRow
              key={row.id}
              row={row}
              expanded={expanded}
              onToggleCluster={toggleCluster}
              onSelect={setAnsweringFor}
            />
          ))}
        </div>
      )}

      {/* Why the fraction above can be smaller than the number of people in the room (#281). */}
      {covered && headcount && <p className="mt-3 text-[11.5px] text-muted-foreground">{headcount}</p>}
      {staff && <p className="mt-2 text-[11.5px] text-muted-foreground">{staff}</p>}

      <AnswerSheet
        member={member}
        position={memberRow?.label}
        pending={pending}
        onRespond={onRespond}
        onClose={() => setAnsweringFor(null)}
      />
    </div>
  )
}

function PositionRow({
  row,
  expanded,
  onToggleCluster,
  onSelect,
}: {
  row: LineupRow
  expanded: ReadonlySet<string>
  onToggleCluster: (key: string) => void
  onSelect: (userId: string) => void
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
        <span className="font-display truncate text-[14px] font-bold leading-none">{row.label}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          {verdict && (
            <span className={`text-[12px] font-semibold ${VERDICT_TONE[row.tone ?? 'short']}`}>{verdict}</span>
          )}
          <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
            {row.required == null ? row.attending : `${row.attending}/${row.required}`}
          </span>
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {going.length > 0 && cluster('in', going, 'going')}
        {row.openSlots > 0 && (
          <span className="flex flex-wrap items-center">
            {Array.from({ length: row.openSlots }, (_, i) => (
              <OpenSlotChip key={i} critical={row.tone === 'critical'} />
            ))}
          </span>
        )}
        {maybe.length > 0 && cluster('maybe', maybe, 'maybe')}
        {out.length > 0 && <span className="opacity-70">{cluster('out', out, 'out')}</span>}
        {row.members.length === 0 && row.openSlots === 0 && (
          <span className="text-[12px] text-muted-foreground">Nobody yet</span>
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
  onSelect: (userId: string) => void
}) {
  const overflows = members.length > CAP
  const shown = expanded || !overflows ? members : members.slice(0, CAP - 1)
  const hidden = members.length - shown.length

  return (
    <span className="flex max-w-full flex-wrap items-center">
      {shown.map((m) => (
        <MemberChip key={m.userId} member={m} onSelect={onSelect} />
      ))}
      {(hidden > 0 || expanded) && overflows && (
        <OverflowChip hidden={hidden} expanded={expanded} label={label} onToggle={onToggle} />
      )}
    </span>
  )
}

/**
 * The one answer control, reached from any chip. A bottom sheet rather than an inline strip because
 * it is a thumb-height target at the bottom of the screen instead of a 26px circle halfway up it,
 * and because it has room to name whose answer is being changed — which matters, since ADR-0003
 * lets a member change a teammate's.
 */
function AnswerSheet({
  member,
  position,
  onRespond,
  onClose,
  pending,
}: {
  member: LineupMember | null
  position?: string
  onRespond: (userId: string, state: LineupState) => void
  onClose: () => void
  pending?: boolean
}) {
  return (
    <Sheet open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {member && (
          <>
            <SheetHeader>
              <SheetTitle>{member.displayName}</SheetTitle>
              <SheetDescription>
                {position ? `${position} · ` : ''}currently {STATE_WORD[member.state].toLowerCase()}
                {!member.isSelf && ' · you are answering for them'}
              </SheetDescription>
            </SheetHeader>
            <AttendanceToggle
              value={member.state}
              disabled={pending}
              onToggle={(state) => {
                onRespond(member.userId, state)
                onClose()
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
