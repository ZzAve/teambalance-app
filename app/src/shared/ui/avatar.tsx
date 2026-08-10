import { avatarColor, avatarInitials } from '@shared/lib/avatar'

/**
 * A person's avatar: a deterministic colour circle (keyed on userId) with their initials. Shared
 * across every listing — the event attendee list and the team roster — so one person reads the same
 * everywhere. Colour + initials logic lives in @shared/lib/avatar.
 */
export function Avatar({ userId, name }: { userId: string; name: string }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: avatarColor(userId) }}
    >
      {avatarInitials(name)}
    </div>
  )
}
