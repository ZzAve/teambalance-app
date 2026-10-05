import { avatarColor, avatarInitials } from '@shared/lib/avatar'

const SIZES = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-16 w-16 text-body',
  lg: 'h-28 w-28 text-title',
}

/**
 * A person's avatar: a deterministic colour circle (keyed on userId) with their initials. Shared
 * across every listing — the event attendee list and the team roster — so one person reads the same
 * everywhere. Colour + initials logic lives in @shared/lib/avatar.
 */
export function Avatar({ userId, name, size = 'sm' }: { userId: string; name: string; size?: keyof typeof SIZES }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]}`}
      style={{ backgroundColor: avatarColor(userId) }}
    >
      {avatarInitials(name)}
    </div>
  )
}
