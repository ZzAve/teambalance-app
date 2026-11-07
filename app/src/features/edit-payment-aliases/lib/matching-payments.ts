import type { Payment } from '@shared/api/money-pool'
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
    (p) => p.direction === 'In' && p.memberId === userId && typeof p.counterpartyName === 'string' && normaliseName(p.counterpartyName) === wanted,
  ).length
}

/**
 * The unattributed incoming payments a name alias would claim, from the payments the viewer can
 * already see. Name only: the counterparty IBAN is never sent to the client, so an IBAN cannot be
 * previewed here.
 */
export function matchingPayments(name: string, payments: Payment[]): { count: number; total: number } {
  const wanted = normaliseName(name)
  if (wanted === '') return { count: 0, total: 0 }
  const hits = payments.filter(
    (p) => p.direction === 'In' && !p.memberId && normaliseName(p.counterpartyName ?? p.name) === wanted,
  )
  return { count: hits.length, total: hits.reduce((sum, p) => sum + p.amount, 0) }
}
