import type { Member } from '@shared/api/members'

/** Promote/demote toggle — a member is either an ADMIN or a plain USER. */
export function toggleRole(role: string): string {
  return role === 'ADMIN' ? 'USER' : 'ADMIN'
}

/**
 * True when `userId` is the sole remaining ADMIN. The backend refuses to demote or remove them
 * (409 LAST_ADMIN); this only drives a UI hint, so the backend stays the source of truth.
 */
export function isLastAdmin(members: Member[], userId: string): boolean {
  const admins = members.filter((m) => m.role === 'ADMIN')
  return admins.length === 1 && admins[0].userId === userId
}
