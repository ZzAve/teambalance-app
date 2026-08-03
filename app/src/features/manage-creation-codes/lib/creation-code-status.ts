import type { CreationCode } from '@shared/api/creation-codes'

export type CreationCodeStatus = 'active' | 'expired' | 'consumed'

/**
 * Derives a code's lifecycle status from its raw fields. `consumed` wins over `expired` — a code
 * redeemed before its expiry is reported as used, not expired. `now` is injected (not read from the
 * clock) so the mapper stays pure and testable. Only `active` codes are revocable.
 */
export function deriveCreationCodeStatus(code: CreationCode, now: Date): CreationCodeStatus {
  if (code.consumedAt) return 'consumed'
  if (code.expiresAt && new Date(code.expiresAt).getTime() <= now.getTime()) return 'expired'
  return 'active'
}

const LABELS: Record<CreationCodeStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  consumed: 'Used',
}

export function creationCodeStatusLabel(status: CreationCodeStatus): string {
  return LABELS[status]
}
