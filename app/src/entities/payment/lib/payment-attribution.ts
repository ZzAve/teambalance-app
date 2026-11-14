import type { Payment } from '@shared/api/money-pool'

export type AttributedTopUp = Payment & { memberId: string }

/** Money that came in and is attributed to a Member. */
export function isAttributedTopUp(payment: Payment): payment is AttributedTopUp {
  return payment.direction === 'In' && !!payment.memberId
}

/** Money that came in and is attributed to no Member yet. */
export function isUnattributedIncoming(payment: Payment): boolean {
  return payment.direction === 'In' && !payment.memberId
}

/** Money that came in and is attributed to the given Member. */
export function isTopUpBy(payment: Payment, memberId: string): boolean {
  return payment.direction === 'In' && payment.memberId === memberId
}
