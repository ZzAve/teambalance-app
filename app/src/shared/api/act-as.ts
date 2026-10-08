import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'
import { throwOnStatus } from './errors'
import { queryKeys } from './query-keys'
import { afterTenantChange } from '@shared/session/session'

// Re-export the generated contract types so the app has a single source of truth.
export type { ActAs } from './generated/model/ActAs'
export type { ActAsRecord } from './generated/model/ActAsRecord'
export type { TeamRef } from './generated/model/TeamRef'

// Carries the backend discriminator so the UI can branch: FORBIDDEN → not a platform admin (a
// no-access shell, not a retry), NOT_FOUND → the team vanished between listing and entering.
// Mirrors CreationCodeError in creation-codes.ts.
export class ActAsError extends Error {
  constructor(
    public readonly code: 'FORBIDDEN' | 'NOT_FOUND' | 'GENERIC',
    message: string,
  ) {
    super(message)
    this.name = 'ActAsError'
  }
}

/** Every team on the platform (ADR-0024 §6). A 403 is the no-access shell; retry cannot help. */
const platformTeamsQueryOptions = queryOptions({
  queryKey: queryKeys.platformTeams,
  retry: false,
  queryFn: async () => {
    const res = await api.ListPlatformTeams()
    throwOnStatus(res, { 403: () => new ActAsError('FORBIDDEN', 'You do not have access to the platform console.') })
    return res.body?.teams ?? []
  },
})

export function usePlatformTeams() {
  return useQuery(platformTeamsQueryOptions)
}

/**
 * Enters a Team as a Platform Admin. Everything the app knows is scoped to the *previous* tenant, so
 * the whole cache is reset — the same reasoning as the Active Team switch in `/t/$slug`.
 */
export function useEnterActAs() {
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await api.EnterActAs({ body: { teamId } })
      throwOnStatus(res, {
        403: () => new ActAsError('FORBIDDEN', 'You do not have access to the platform console.'),
        404: () => new ActAsError('NOT_FOUND', 'That team no longer exists.'),
      })
      if (res.status !== 200) throw new ActAsError('GENERIC', 'Could not enter that team. Please try again.')
      return res.body
    },
    onSuccess: () => afterTenantChange(),
  })
}

/**
 * Leaves the Team. Never refused, so the only failure worth surfacing is the network. The cache is
 * not reset here: the caller leaves the page entirely (see `goToConsole`), which is the only way to
 * drop tenant-scoped queries without refetching them against a tenant that is already gone.
 */
export function useExitActAs() {
  return useMutation({
    mutationFn: async () => {
      await api.ExitActAs()
    },
  })
}

/** The Act-as Record for the Active Team, newest first — readable by every Member (ADR-0024 §4). */
export function useActAsRecords() {
  return useQuery({
    queryKey: queryKeys.actAsRecords,
    retry: false,
    queryFn: async () => {
      const res = await api.ListActAsRecords()
      throwOnStatus(res, { 403: () => new ActAsError('FORBIDDEN', 'You do not have access to this team.') })
      return res.body?.records ?? []
    },
  })
}
