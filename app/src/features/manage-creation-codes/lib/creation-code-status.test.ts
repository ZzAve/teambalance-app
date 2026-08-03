import { describe, expect, it } from 'vitest'
import type { CreationCode } from '@shared/api/creation-codes'
import { creationCodeStatusLabel, deriveCreationCodeStatus } from './creation-code-status'

const NOW = new Date('2026-08-03T12:00:00Z')

function code(overrides: Partial<CreationCode>): CreationCode {
  return {
    code: 'ABCD-EFGH-JKLM',
    createdAt: '2026-08-01T00:00:00Z',
    expiresAt: undefined,
    consumedAt: undefined,
    consumedByUserId: undefined,
    createdTeamId: undefined,
    ...overrides,
  }
}

describe('deriveCreationCodeStatus', () => {
  it('is active when unconsumed and unexpired', () => {
    expect(deriveCreationCodeStatus(code({}), NOW)).toBe('active')
  })

  it('is active when the expiry is in the future', () => {
    expect(deriveCreationCodeStatus(code({ expiresAt: '2099-01-01T00:00:00Z' }), NOW)).toBe('active')
  })

  it('is expired when the expiry has passed and it was never consumed', () => {
    expect(deriveCreationCodeStatus(code({ expiresAt: '2026-08-03T11:59:59Z' }), NOW)).toBe('expired')
  })

  it('treats the exact expiry instant as expired (boundary)', () => {
    expect(deriveCreationCodeStatus(code({ expiresAt: '2026-08-03T12:00:00Z' }), NOW)).toBe('expired')
  })

  it('is consumed once redeemed, even if it had not yet expired', () => {
    const redeemed = code({ consumedAt: '2026-08-02T00:00:00Z', expiresAt: '2099-01-01T00:00:00Z' })
    expect(deriveCreationCodeStatus(redeemed, NOW)).toBe('consumed')
  })

  it('reports consumed over expired when a code was used before an expiry that has since passed', () => {
    const redeemed = code({ consumedAt: '2026-08-01T00:00:00Z', expiresAt: '2026-08-02T00:00:00Z' })
    expect(deriveCreationCodeStatus(redeemed, NOW)).toBe('consumed')
  })
})

describe('creationCodeStatusLabel', () => {
  it('maps each status to its human label', () => {
    expect(creationCodeStatusLabel('active')).toBe('Active')
    expect(creationCodeStatusLabel('expired')).toBe('Expired')
    expect(creationCodeStatusLabel('consumed')).toBe('Used')
  })
})
