import { teamPhotoUrl } from '@shared/api/photos'
import { Avatar } from '@shared/ui/avatar'

/** A Member's Team Photo (or initials) with their Shirt Number as a badge on its lower edge (ADR-0038). */
export function MemberFace({
  userId,
  name,
  shirtNumber,
  photoVersion,
  size,
}: {
  userId: string
  name: string
  shirtNumber?: number
  photoVersion?: string
  size: 'md' | 'lg'
}) {
  return (
    <div className="relative">
      <Avatar userId={userId} name={name} size={size} photoUrl={photoVersion ? teamPhotoUrl(userId, photoVersion) : undefined} />
      {/* The API sends null for "no number" although the generated type says undefined. */}
      {typeof shirtNumber === 'number' && (
        <span
          aria-label={`Shirt number ${shirtNumber}`}
          className={[
            'absolute rounded-full border-background bg-foreground text-center font-bold text-background',
            size === 'md'
              ? '-bottom-1 left-1/2 min-w-6 -translate-x-1/2 border-2 px-1 text-caption leading-4'
              : '-right-1 -bottom-1 min-w-9 border-4 px-1.5 font-display text-body',
          ].join(' ')}
        >
          {shirtNumber}
        </span>
      )}
    </div>
  )
}
