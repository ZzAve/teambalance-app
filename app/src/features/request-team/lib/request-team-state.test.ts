import { describe, expect, it } from 'vitest'
import type { TeamRequest } from '@shared/api/team-requests'
import { deriveRequestTeamState } from './request-team-state'

function request(overrides: Partial<TeamRequest>): TeamRequest {
  return {
    id: 'r1',
    teamName: 'Tovo Heren 4',
    purpose: 'We play on Tuesdays',
    status: 'PENDING',
    requesterEmail: 'a@example.com',
    requestedAt: '2026-11-01T00:00:00Z',
    decidedAt: undefined,
    rejectReason: undefined,
    creationCode: undefined,
    ...overrides,
  }
}

describe('deriveRequestTeamState', () => {
  it('shows the form when there is no request', () => {
    expect(deriveRequestTeamState(null)).toEqual({ kind: 'form' })
  })

  it('shows waiting for a pending request', () => {
    expect(deriveRequestTeamState(request({}))).toEqual({ kind: 'pending', teamName: 'Tovo Heren 4' })
  })

  it('offers the code and name for an approved request with a usable code', () => {
    expect(deriveRequestTeamState(request({ status: 'APPROVED', creationCode: 'AAAA-BBBB' }))).toEqual({
      kind: 'approved',
      teamName: 'Tovo Heren 4',
      code: 'AAAA-BBBB',
    })
  })

  it('shows the form again when the approved code is used or lapsed (no code)', () => {
    expect(deriveRequestTeamState(request({ status: 'APPROVED' }))).toEqual({ kind: 'form' })
  })

  it('shows the rejection with its reason', () => {
    expect(deriveRequestTeamState(request({ status: 'REJECTED', rejectReason: 'Too vague' }))).toEqual({
      kind: 'rejected',
      reason: 'Too vague',
    })
  })

  it('shows the rejection without a reason', () => {
    expect(deriveRequestTeamState(request({ status: 'REJECTED' }))).toEqual({ kind: 'rejected', reason: undefined })
  })
})
