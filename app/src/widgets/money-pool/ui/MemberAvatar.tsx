import type { Member } from '@shared/api/members'
import { teamPhotoUrl } from '@shared/api/photos'
import { Avatar } from '@shared/ui/avatar'

/** A member's avatar with their team photo when they have one. */
export function MemberAvatar({ memberId, member, name, size = 'sm' }: { memberId: string; member: Member | undefined; name: string; size?: 'sm' | 'md' }) {
  const photoVersion = member?.photoVersion
  return <Avatar userId={memberId} name={name} size={size} photoUrl={photoVersion ? teamPhotoUrl(memberId, photoVersion) : undefined} />
}
