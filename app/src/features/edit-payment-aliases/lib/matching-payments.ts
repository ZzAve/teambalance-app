import type { Payment } from '@shared/api/money-pool'
import { normaliseName } from './normalise-name'

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
