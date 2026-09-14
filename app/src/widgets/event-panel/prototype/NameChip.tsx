import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { STATE_WORD, type LineupMember, type LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway. The roster chip: a name, overlapped.
 *
 * **Overlap for grouping, never for truncation** (validation §1). The earlier version let chips
 * shrink past their own text so a crowded position "tightened" to four or five characters each.
 * Measuring that against WCAG 1.4.12 killed it: applying the standard text-spacing override clipped
 * three of eighteen names that had been readable, which is failure technique F104 — a documented AA
 * failure, not a judgement call. So a chip is now exactly as wide as its name and never shrinks. The
 * overlap is a fixed pull-back that survives any spacing, because it eats the gap between chips
 * rather than the letters inside them.
 *
 * What the overlap still buys is the thing it was actually borrowed for: the facepile reading, where
 * a run of overlapping items is one group rather than a row of separate cells. Crowding is absorbed
 * by the `+N` chip below instead (validation §2) — which is what every avatar-group implementation
 * already does.
 *
 * The pull-back is `margin-right`, not `margin-left`, so a fan that wraps starts its second row flush
 * at the container edge instead of hanging 10px outside it.
 *
 * The identity dot stays (validation §4): chip guidance recommends a leading avatar precisely to keep
 * chips apart in a crowd, and it is the only thing carrying the colour a teammate is known by
 * elsewhere in the app. Identity lives in the dot, state in the pill; neither does both jobs.
 */

const PILL: Record<LineupState, string> = {
  ATTENDING: 'bg-green/12 border-green/45 text-green-dark',
  MAYBE: 'bg-gold/20 border-gold/55 text-gold-dark',
  NOT_RESPONDED: 'bg-muted border-border text-muted-foreground',
  ABSENT: 'bg-red/10 border-red/35 text-red',
}

// The gap the next chip eats. Enough to interlock the rings and read as one group; never enough to
// reach a letter, because a chip is never narrower than its own name.
const OVERLAP = '-mr-2.5 last:mr-0'

const CHIP =
  'relative flex shrink-0 max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border py-0.5 pl-0.5 pr-2.5 text-[12.5px] font-semibold ring-2 ring-card'

export function NameChip({ member, onClick }: { member: LineupMember; onClick: () => void }) {
  const first = member.displayName.split(' ')[0]

  return (
    <button
      type="button"
      onClick={onClick}
      // One string for the whole control (validation §3). The visible first name used to sit in the
      // accessible name alongside a visually-hidden full one, so a screen reader announced
      // "Anna Anna Bakker — Going. Change their answer". aria-label replaces the content entirely.
      aria-label={`${member.displayName}${member.isSelf ? ' (you)' : ''} — ${STATE_WORD[member.state]}. Change their answer`}
      title={`${member.displayName} — ${STATE_WORD[member.state]}`}
      className={`${CHIP} ${OVERLAP} ${PILL[member.state]}`}
    >
      <span
        aria-hidden
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
        style={{ backgroundColor: avatarColor(member.userId) }}
      >
        {avatarInitials(member.displayName)}
      </span>
      <span aria-hidden>{first}</span>
      {member.isSelf && (
        <span aria-hidden className="shrink-0 text-[10px] font-bold text-blue">
          you
        </span>
      )}
    </button>
  )
}

/**
 * The rest of a crowded fan, collapsed (validation §2). Atlassian's avatar group caps at four and
 * hands the remainder to a `+N`; Emplifi's caps at five. This is that move, and it is what makes the
 * "never clip a name" rule affordable — the overflow goes somewhere rather than into the letters.
 */
export function OverflowChip({
  hidden,
  expanded,
  label,
  onClick,
}: {
  hidden: number
  expanded: boolean
  /** What the fan holds, for the accessible name: "3 more going", "2 more out". */
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={expanded ? `Show fewer ${label}` : `Show ${hidden} more ${label}`}
      className={`${CHIP} ${OVERLAP} border-border bg-card pl-2.5 text-muted-foreground`}
    >
      <span aria-hidden>{expanded ? 'less' : `+${hidden}`}</span>
    </button>
  )
}

/** An unfilled slot, sitting in the fan at chip height so a hole is part of the row, not after it. */
export function ChipHole({ critical = false }: { critical?: boolean }) {
  return (
    <span
      aria-hidden
      className={`${OVERLAP} flex h-[26px] shrink-0 items-center justify-center rounded-full border border-dashed px-3 text-[12px] font-bold ring-2 ring-card ${critical ? 'border-red/55 bg-card text-red' : 'border-muted-foreground/40 bg-card text-muted-foreground'}`}
    >
      +
    </span>
  )
}
