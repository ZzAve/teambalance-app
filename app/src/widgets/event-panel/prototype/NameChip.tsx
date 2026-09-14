import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { STATE_WORD, type LineupMember, type LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway. Round three's chip: **a name, overlapped**.
 *
 * The review that picked D also said what was wrong with it — initials are weak identity while the
 * app has no real avatar photos, so two letters in a circle is a colour, not a person. This carries
 * the first name instead, and buys the density back by letting the chips **overlap** so only each
 * one's head shows: enough to recognise a teammate you already know, with the last chip whole.
 *
 * It also settles the round-two question of whether a chip's colour means identity or state, by
 * refusing the choice: the **avatar dot carries identity** (the member's own colour, the one the
 * team page uses) and the **pill carries state**. Neither has to do both.
 *
 * How the fan works: flexbox, not arithmetic. Each chip after the first pulls back over its
 * neighbour by a fixed amount and is allowed to shrink to a floor, so a crowded position tightens
 * on its own — the more people, the less of each name, down to about four characters — and a quiet
 * one shows whole names. `text-overflow: clip`, deliberately: an ellipsis would sit under the chip
 * on top of it, and the overlap is already the "there is more here" signal.
 */

const PILL: Record<LineupState, string> = {
  ATTENDING: 'bg-green/12 border-green/45 text-green-dark',
  MAYBE: 'bg-gold/20 border-gold/55 text-gold-dark',
  NOT_RESPONDED: 'bg-muted border-border text-muted-foreground',
  ABSENT: 'bg-red/10 border-red/35 text-red',
}

interface NameChipProps {
  member: LineupMember
  /** Drop the identity dot and spend the width on letters instead — variant G's whole difference. */
  withAvatar?: boolean
  onClick: () => void
}

export function NameChip({ member, withAvatar = true, onClick }: NameChipProps) {
  const first = member.displayName.split(' ')[0]

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${member.displayName} — ${STATE_WORD[member.state]}`}
      // `-ml-2.5` is the overlap, `first:ml-0` exempts the leading chip, and `last:shrink-0` keeps
      // the final one whole so the row never ends mid-name. `min-w-0` + a basis floor is what lets
      // flexbox tighten the fan instead of overflowing the card.
      // `basis-auto` (not a fixed basis) so a chip's natural size is its name; `shrink` + a
      // `min-w` floor is what lets a crowded fan tighten to about four characters and no further.
      // `last:shrink-0` keeps the final chip whole, and so does your own — you should always be
      // able to find yourself in the row, however full it is.
      className={`relative -ml-2.5 flex shrink basis-auto items-center gap-1 overflow-hidden text-clip whitespace-nowrap rounded-full border py-0.5 pl-0.5 pr-2.5 text-[12.5px] font-semibold ring-2 ring-card first:ml-0 last:shrink-0 ${withAvatar ? 'min-w-[58px]' : 'min-w-[46px]'} ${member.isSelf ? 'shrink-0' : ''} ${PILL[member.state]}`}
    >
      {withAvatar ? (
        <span
          aria-hidden
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ backgroundColor: avatarColor(member.userId) }}
        >
          {avatarInitials(member.displayName)}
        </span>
      ) : (
        <span className="pl-2" />
      )}
      <span className="min-w-0 shrink">{first}</span>
      {member.isSelf && <span className="shrink-0 text-[10px] font-bold text-blue">you</span>}

      <span className="sr-only">
        {member.displayName} — {STATE_WORD[member.state]}. Change their answer
      </span>
    </button>
  )
}

/** An unfilled slot, sitting in the fan at chip height so a hole is part of the row, not after it. */
export function ChipHole({ critical = false }: { critical?: boolean }) {
  return (
    <span
      aria-hidden
      className={`-ml-2.5 flex h-[26px] shrink-0 items-center justify-center rounded-full border border-dashed px-3 text-[12px] font-bold ring-2 ring-card first:ml-0 ${critical ? 'border-red/55 bg-card text-red' : 'border-muted-foreground/40 bg-card text-muted-foreground'}`}
    >
      +
    </span>
  )
}
