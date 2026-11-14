import type { Payment } from '@shared/api/money-pool'
import { isUnattributedIncoming } from '@entities/payment/lib/payment-attribution'
import type { ActAs } from '@shared/api/generated/model/ActAs'

/**
 * Which claim control a viewer gets on a payment row: 'member' claims for themselves, 'admin' picks
 * a member, null shows nothing. Only an unattributed incoming payment can be claimed. Acting as a
 * team (ADR-0024) gives the Admin rights but no membership, so there is no member variant.
 */
export function claimVariant(
  user: { role?: string; actAs?: ActAs } | null,
  payment: Payment,
): 'member' | 'admin' | null {
  if (!user || !isUnattributedIncoming(payment)) return null
  if (user.role === 'ADMIN') return 'admin'
  return user.actAs ? null : 'member'
}
