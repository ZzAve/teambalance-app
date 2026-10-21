import { Avatar } from '@shared/ui/avatar'
import { teamPhotoUrl } from '@shared/api/photos'
import { SubstituteAvatar } from './SubstituteAvatar'
import { findSomeone, type LineupMember, type LineupState } from '../lib/lineup'
import { ATTENDANCE_WORDS } from '../lib/attendance-words'

/**
 * A person in a lineup row: their colour, their first name, their answer.
 *
 * **Identity is the dot, state is the pill.** A single circle cannot carry both meanings at once —
 * a teammate whose avatar colour is gold read as "maybe" next to one whose was green — so the two
 * are split. The dot keeps the colour the team page and the attendee list already know them by; the
 * pill carries green / gold / red / neutral for the answer.
 *
 * **Chips sit apart, and are width-capped.** The position's box groups them, so they no longer
 * overlap. The name is capped near 16 characters and ellipsed past it; the full name stays in the
 * tooltip and the accessible name. Crowding is still absorbed by [OverflowChip].
 *
 * Presentational and prop-only (ADR-0017): the answer arrives as a prop and the tap is a callback.
 */

const PILL: Record<LineupState, string> = {
  ATTENDING: 'bg-green/12 border-green/45 text-green-dark',
  MAYBE: 'bg-gold/20 border-gold/55 text-gold-dark',
  NOT_RESPONDED: 'bg-muted border-border text-muted-foreground',
  ABSENT: 'bg-red/10 border-red/35 text-red',
}

const CHIP =
  'relative flex shrink-0 max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border py-0.5 pl-0.5 pr-2.5 text-small font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface MemberChipProps {
  member: LineupMember
  /** Fires with the member's own id — a teammate's answer is editable from here (ADR-0003). */
  onSelect: (userId: string) => void
}

export function MemberChip({ member, onSelect }: MemberChipProps) {
  const who = member.isSubstitute ? `${member.displayName}, substitute` : `${member.displayName}${member.isSelf ? ' (you)' : ''}`
  return (
    <button
      type="button"
      onClick={() => onSelect(member.userId)}
      // One string for the whole control. Without it the visible first name lands in the accessible
      // name alongside the full one and a screen reader says "Anna Anna Bakker — Going".
      aria-label={`${who} — ${ATTENDANCE_WORDS[member.state].word}. Change their answer`}
      title={`${member.displayName} — ${ATTENDANCE_WORDS[member.state].word}`}
      className={`${CHIP} ${PILL[member.state]} ${member.isSelf ? 'shrink-0' : ''}`}
    >
      {member.isSubstitute ? (
        <SubstituteAvatar name={member.displayName} className="size-5 bg-card" />
      ) : (
        <Avatar
          userId={member.userId}
          name={member.displayName}
          size="xs"
          photoUrl={member.photoVersion ? teamPhotoUrl(member.userId, member.photoVersion) : undefined}
        />
      )}
      <span aria-hidden className="min-w-0 max-w-[16ch] truncate">{member.chipName}</span>
      {member.isSelf && (
        <span aria-hidden className="shrink-0 text-caption font-bold text-blue">
          you
        </span>
      )}
      {member.isSubstitute && (
        <span aria-hidden className="shrink-0 text-caption font-bold text-purple-ink">
          Sub
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
      className={`${CHIP} border-border bg-card pl-2.5 text-muted-foreground`}
    >
      <span aria-hidden>{expanded ? 'less' : `+${hidden}`}</span>
    </button>
  )
}

/**
 * A row's required slots with nobody in them, one "+" per slot at chip height, so a gap sits *in*
 * the row rather than after it. One button for all of them: tapping looks for someone to fill the
 * Position, and the picker opens for it (#359). The purple matches the other Substitute controls.
 */
export function OpenSlotChip({
  positionLabel,
  openSlots,
  onFind,
}: {
  positionLabel: string
  openSlots: number
  onFind: () => void
}) {
  return (
    <button
      type="button"
      onClick={onFind}
      aria-label={findSomeone(positionLabel)}
      // The "+" keeps chip size; `tap-band` stretches the tap target to 44px each way (F7).
      className="tap-band after:-inset-x-1.5 flex flex-wrap items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {Array.from({ length: openSlots }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`flex h-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-purple bg-card px-3 text-small font-bold text-purple-ink hover:bg-purple/5`}
        >
          +
        </span>
      ))}
    </button>
  )
}
