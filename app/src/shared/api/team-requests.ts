import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { i18n } from '@shared/i18n/i18n'
import { api } from './wirespec-client'

export type { TeamRequest } from './generated/model/TeamRequest'

export type TeamRequestErrorCode =
  | 'INVALID_NAME'
  | 'INVALID_PURPOSE'
  | 'INVALID_REASON'
  | 'NOT_PENDING'
  | 'FORBIDDEN'
  | 'GENERIC'

// 409 means "already pending" on submit and "already decided" on approve/reject; one code, worded
// per context by the View.
export class TeamRequestError extends Error {
  constructor(public readonly code: TeamRequestErrorCode, message: string) {
    super(message)
    this.name = 'TeamRequestError'
  }
}

export function toTeamRequestError(status: number, code: string | undefined): TeamRequestError {
  if (status === 409) return new TeamRequestError('NOT_PENDING', 'Request is not pending')
  if (status === 403) return new TeamRequestError('FORBIDDEN', 'Not allowed')
  if (status === 400 && (code === 'INVALID_NAME' || code === 'INVALID_PURPOSE' || code === 'INVALID_REASON')) {
    return new TeamRequestError(code, code)
  }
  return new TeamRequestError('GENERIC', i18n.t('errors.teamRequest.generic'))
}

const bodyCode = (body: unknown) => (body as { code?: string } | undefined)?.code

// 404 = the caller never asked: null, not an error.
export function useMyTeamRequest() {
  return useQuery({
    queryKey: ['team-requests', 'mine'],
    queryFn: async () => {
      const res = await api.getMyTeamRequest()
      return res.status === 200 ? res.body : null
    },
  })
}

export function useSubmitTeamRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { teamName: string; purpose: string }) => {
      const res = await api.submitTeamRequest({ body }).catch(() => {
        throw new TeamRequestError('GENERIC', i18n.t('errors.teamRequest.generic'))
      })
      if (res.status === 201) return res.body
      throw toTeamRequestError(res.status, bodyCode(res.body))
    },
    // Also on failure: a 409 means the card's copy of the latest request is stale.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['team-requests'] }),
  })
}

// Platform admins only: 403 throws FORBIDDEN, retry is off since it can't help.
export function useTeamRequests() {
  return useQuery({
    queryKey: ['team-requests', 'admin'],
    retry: false,
    queryFn: async () => {
      const res = await api.listTeamRequests()
      if (res.status === 403) throw toTeamRequestError(403, undefined)
      return res.body?.requests ?? []
    },
  })
}

export function useApproveTeamRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.approveTeamRequest({ id })
      if (res.status === 200) return res.body
      throw toTeamRequestError(res.status, bodyCode(res.body))
    },
    // Also on failure: a 409 means the list is stale.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['team-requests'] }),
  })
}

export function useRejectTeamRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await api.rejectTeamRequest({ id, body: { reason } })
      if (res.status === 200) return res.body
      throw toTeamRequestError(res.status, bodyCode(res.body))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['team-requests'] }),
  })
}
