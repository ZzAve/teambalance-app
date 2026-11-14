import type { Payment } from '@shared/api/money-pool'
import { isTopUpBy, isUnattributedIncoming } from '@entities/payment/lib/payment-attribution'
import { normaliseName } from './normalise-name'

/**
 * Incoming payments already attributed to `userId` whose counterparty name matches a saved name
 * alias: what the alias row shows after Save, when the payments are no longer unmatched. Needs
 * `counterpartyName`, which only the owner and Admins receive; without it nothing is counted.
 */
export function attributedMatchCount(name: string, userId: string, payments: Payment[]): number {
  const wanted = normaliseName(name)
  if (wanted === '') return 0
  return payments.filter(
    (p) => isTopUpBy(p, userId) && typeof p.counterpartyName === 'string' && normaliseName(p.counterpartyName) === wanted,
  ).length
}

/**
 * The unattributed incoming payments a name alias would claim, from the payments the viewer can
 * already see. Name only: the counterparty IBAN is never sent to the client, so an IBAN cannot be
 * previewed here.
 */
export function matchingPayments(name: string, payments: Payment[]): number {
  const wanted = normaliseName(name)
  if (wanted === '') return 0
  return payments.filter(
    (p) => isUnattributedIncoming(p) && normaliseName(p.counterpartyName ?? p.name) === wanted,
  ).length
}
