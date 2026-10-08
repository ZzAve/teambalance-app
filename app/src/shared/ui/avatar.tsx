import { useState } from 'react'
import { avatarColor, avatarInitials } from '@shared/lib/avatar'

const SIZES = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-16 w-16 text-body',
  lg: 'h-28 w-28 text-title',
}

/**
 * A person's avatar: their photo when there is one and it loads, else a deterministic colour circle (keyed on
 * userId) with their initials. Shared across every listing — the event attendee list and the team
 * roster — so one person reads the same everywhere. Colour + initials logic lives in @shared/lib/avatar.
 */
export function Avatar({
  userId,
  name,
  size = 'sm',
  photoUrl,
}: {
  userId: string
  name: string
  size?: keyof typeof SIZES
  photoUrl?: string
}) {
  // The URL that failed to load, so a photo that cannot be fetched (offline, removed meanwhile)
  // falls back to initials instead of a broken image; a new URL gets a fresh try.
  const [failedUrl, setFailedUrl] = useState<string>()
  if (photoUrl && photoUrl !== failedUrl) {
    // Decorative: every place an avatar appears also shows or labels the name.
    return (
      <img
        src={photoUrl}
        alt=""
        onError={() => setFailedUrl(photoUrl)}
        className={`shrink-0 rounded-full object-cover ${SIZES[size]}`}
      />
    )
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]}`}
      style={{ backgroundColor: avatarColor(userId) }}
    >
      {avatarInitials(name)}
    </div>
  )
}
