import type { TeamRequest } from '@shared/api/team-requests'

export type RequestTeamState =
  | { kind: 'form' }
  | { kind: 'pending'; teamName: string }
  | { kind: 'approved'; teamName: string; code: string }
  | { kind: 'rejected'; reason: string | undefined }

/**
 * What the request card shows for the caller's latest request (ADR-0047). An APPROVED request without
 * a `creationCode` has been used or has lapsed, so the person may ask again: the form.
 */
export function deriveRequestTeamState(request: TeamRequest | null | undefined): RequestTeamState {
  if (!request) return { kind: 'form' }
  switch (request.status) {
    case 'PENDING':
      return { kind: 'pending', teamName: request.teamName }
    case 'APPROVED':
      return request.creationCode
        ? { kind: 'approved', teamName: request.teamName, code: request.creationCode }
        : { kind: 'form' }
    case 'REJECTED':
      return { kind: 'rejected', reason: request.rejectReason }
  }
}
