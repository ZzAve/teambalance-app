import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { STATE_WORD, type LineupMember, type LineupState } from '../lib/lineup'

/**
 * A person in a lineup row: their colour, their first name, their answer.
 *
 * **Identity is the dot, state is the pill.** A single circle cannot carry both meanings at once —
 * a teammate whose avatar colour is gold read as "maybe" next to one whose was green — so the two
 * are split. The dot keeps the colour the team page and the attendee list already know them by; the
 * pill carries green / gold / red / neutral for the answer.
 *
 * **Chips overlap, and never clip.** The pull-back is what makes a position read as one group rather
 * than a row of separate cells — the facepile idiom, which is why it is borrowed rather than
 * invented. What is *not* borrowed is occluding the text: an earlier draft let chips shrink past
 * their own names to save width, and applying the WCAG 1.4.12 text-spacing override then clipped
 * three names in eighteen, which is failure technique F104. So a chip is exactly as wide as its
 * name, and crowding is absorbed by [OverflowChip] instead. The overlap eats the gap between chips
 * at every text size.
 *
 * The pull-back is `margin-right`, not `margin-left`, so a run that wraps starts its second line
 * flush at the container edge instead of hanging outside it.
 *
 * Presentational and prop-only (ADR-0017): the answer arrives as a prop and the tap is a callback.
 */

const PILL: Record<LineupState, string> = {
  ATTENDING: 'bg-green/12 border-green/45 text-green-dark',
  MAYBE: 'bg-gold/20 border-gold/55 text-gold-dark',
  NOT_RESPONDED: 'bg-muted border-border text-muted-foreground',
  ABSENT: 'bg-red/10 border-red/35 text-red',
}

/** The gap the next chip eats. Never enough to reach a letter — a chip cannot be narrower than its name. */
const OVERLAP = '-mr-2.5 last:mr-0'

const CHIP =
  'relative flex shrink-0 max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border py-0.5 pl-0.5 pr-2.5 text-small font-semibold ring-2 ring-card ring-offset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface MemberChipProps {
  member: LineupMember
  /** Fires with the member's own id — a teammate's answer is editable from here (ADR-0003). */
  onSelect: (userId: string) => void
}

export function MemberChip({ member, onSelect }: MemberChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member.userId)}
      // One string for the whole control. Without it the visible first name lands in the accessible
      // name alongside the full one and a screen reader says "Anna Anna Bakker — Going".
      aria-label={`${member.displayName}${member.isSelf ? ' (you)' : ''} — ${STATE_WORD[member.state]}. Change their answer`}
      title={`${member.displayName} — ${STATE_WORD[member.state]}`}
      className={`${CHIP} ${OVERLAP} ${PILL[member.state]} ${member.isSelf ? 'shrink-0' : ''}`}
    >
      <span
        aria-hidden
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-caption font-bold text-white"
        style={{ backgroundColor: avatarColor(member.userId) }}
      >
        {avatarInitials(member.displayName)}
      </span>
      <span aria-hidden>{member.chipName}</span>
      {member.isSelf && (
        <span aria-hidden className="shrink-0 text-caption font-bold text-blue">
          you
        </span>
      )}
    </button>
  )
}

/**
 * The rest of a crowded run, collapsed. Every avatar group this borrows from caps the visible items
 * and hands the remainder to a counter (Atlassian at four, Emplifi at five); doing the same here is
 * what lets [MemberChip] refuse to clip a name — the overflow goes somewhere rather than into the
 * letters.
 */
export function OverflowChip({
  hidden,
  expanded,
  /** What the run holds, for the accessible name: "3 more going", "2 more out". */
  label,
  onToggle,
}: {
  hidden: number
  expanded: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={expanded ? `Show fewer ${label}` : `Show ${hidden} more ${label}`}
      className={`${CHIP} ${OVERLAP} border-border bg-card pl-2.5 text-muted-foreground`}
    >
      <span aria-hidden>{expanded ? 'less' : `+${hidden}`}</span>
    </button>
  )
}

/**
 * A required slot with nobody in it, drawn at chip height so a gap sits *in* the row rather than
 * after it. Decorative: the row's verdict word and fraction already state the same fact in text.
 */
export function OpenSlotChip({ critical = false }: { critical?: boolean }) {
  return (
    <span
      aria-hidden
      className={`${OVERLAP} flex h-[26px] shrink-0 items-center justify-center rounded-full border border-dashed px-3 text-small font-bold ring-2 ring-card ${critical ? 'border-red/55 bg-card text-red' : 'border-muted-foreground/40 bg-card text-muted-foreground'}`}
    >
      +
    </span>
  )
}
