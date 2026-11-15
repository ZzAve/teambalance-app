import type { Payment } from '@shared/api/money-pool'

export type AttributedTopUp = Payment & { memberId: string }

/**
 * Money that came in, or an Out-of-pocket Expense: the Member paid it with their own money, which counts
 * as money in of the same amount (ADR-0048).
 */
export function countsAsIncoming(payment: Payment): boolean {
  return payment.direction === 'In' || payment.outOfPocket
}

/** A Member's contribution: money that came in and is attributed to them, or an Out-of-pocket Expense they paid. */
export function isAttributedTopUp(payment: Payment): payment is AttributedTopUp {
  return countsAsIncoming(payment) && !!payment.memberId
}

/** Money that came in and is attributed to no Member yet. */
export function isUnattributedIncoming(payment: Payment): boolean {
  return payment.direction === 'In' && !isAttributedTopUp(payment)
}

/** Money that came in and is attributed to the given Member. */
export function isTopUpBy(payment: Payment, memberId: string): boolean {
  return payment.direction === 'In' && payment.memberId === memberId
}
