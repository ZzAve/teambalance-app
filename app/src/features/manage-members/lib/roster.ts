import type { Member, Role } from '@shared/api/members'

/** Promote/demote toggle — a member is either an ADMIN or a plain USER. */
export function toggleRole(role: Role): Role {
  return role === 'ADMIN' ? 'USER' : 'ADMIN'
}

/** The roster order on /team: by Shirt Number, members without one last (ADR-0038). */
export function sortByShirtNumber(members: Member[]): Member[] {
  const key = (m: Member) => m.shirtNumber ?? Number.MAX_SAFE_INTEGER
  return [...members].sort((a, b) => key(a) - key(b))
}
