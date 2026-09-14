import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { STATE_WORD, type LineupMember, type LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway. The second round's face chip, shared by D and E.
 *
 * The first round's verdict was that pips and pills read as spreadsheet cells. This keeps the
 * member's own identity colour — the one the rest of the app already knows them by — and puts the
 * **answer in a ring around it**, so a face is a person first and a status second. A settled no is
 * desaturated as well as ringed, because a row's news is who is in, and the noes should not shout
 * as loudly as the holes do.
 */

const RING: Record<LineupState, string> = {
  ATTENDING: 'ring-green',
  MAYBE: 'ring-gold',
  NOT_RESPONDED: 'ring-muted-foreground/45',
  ABSENT: 'ring-red',
}

// Opacity only. A `saturate` filter applies to the whole element, ring included, which flattened
// "can't" and "awaiting" into the same grey circle — exactly what the ring is there to prevent.
const DIM: Record<LineupState, string> = {
  ATTENDING: '',
  MAYBE: '',
  NOT_RESPONDED: 'opacity-60',
  ABSENT: 'opacity-55',
}

interface FaceProps {
  member: LineupMember
  size?: number
  /** Overlap the face to its left, so a run of them reads as one huddle rather than a list. */
  stacked?: boolean
  onClick?: () => void
  selected?: boolean
}

export function Face({ member, size = 32, stacked = false, onClick, selected = false }: FaceProps) {
  // Overlap has to scale with the face: the 4px that reads as a huddle at 32px eats a third of a
  // 22px face, and the initials are the only identity a stacked face has. Below 26px the faces sit
  // shoulder to shoulder with a hair of daylight instead — same group, legible letters.
  const overlap = !stacked ? '' : size >= 30 ? '-ml-1 first:ml-0' : size >= 26 ? '-ml-0.5 first:ml-0' : 'ml-1 first:ml-0'
  const className = `relative flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-offset-2 ring-offset-card transition-transform ${RING[member.state]} ${DIM[member.state]} ${overlap} ${selected ? 'z-10 scale-110' : ''}`
  const style = {
    width: size,
    height: size,
    fontSize: size <= 24 ? 9 : 11,
    backgroundColor: avatarColor(member.userId),
  }
  const label = `${member.displayName} — ${STATE_WORD[member.state]}`

  if (!onClick) {
    return (
      <span className={className} style={style} title={label}>
        {avatarInitials(member.displayName)}
      </span>
    )
  }

  return (
    <button type="button" onClick={onClick} title={label} className={className} style={style}>
      {avatarInitials(member.displayName)}
      <span className="sr-only">{label}. Change their answer</span>
    </button>
  )
}

/** An unfilled slot, drawn at face size so a hole sits in the huddle rather than beside it. */
export function Hole({ size = 32, critical = false }: { size?: number; critical?: boolean }) {
  const overlap = size >= 30 ? '-ml-1' : size >= 26 ? '-ml-0.5' : 'ml-1'
  return (
    <span
      aria-hidden
      className={`${overlap} flex shrink-0 items-center justify-center rounded-full border-2 border-dashed ring-2 ring-offset-2 ring-transparent ring-offset-card first:ml-0 ${critical ? 'border-red/60 text-red/70' : 'border-muted-foreground/35 text-muted-foreground/50'}`}
      style={{ width: size, height: size, fontSize: size <= 24 ? 11 : 13 }}
    >
      +
    </span>
  )
}
