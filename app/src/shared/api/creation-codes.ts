import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import { throwOnStatus } from './errors'
import { queryKeys } from './query-keys'

// Re-export the generated contract type so the app has a single source of truth.
export type { CreationCode } from './generated/model/CreationCode'

// Carries the backend discriminator so the UI can branch: FORBIDDEN → no-access shell (not a retry),
// CONSUMED → revoke refused, NOT_FOUND → revoke raced a delete. Mirrors PositionError in positions.ts.
export class CreationCodeError extends Error {
  constructor(public readonly code: 'FORBIDDEN' | 'CONSUMED' | 'NOT_FOUND', message: string) {
    super(message)
    this.name = 'CreationCodeError'
  }
}

const forbidden = () => new CreationCodeError('FORBIDDEN', 'You do not have access to creation codes.')

// A 403 throws FORBIDDEN so the container renders the no-access shell; retry is off since it can't help.
export function useCreationCodes() {
  return useQuery({
    queryKey: queryKeys.creationCodes,
    retry: false,
    queryFn: async () => {
      const res = await api.ListCreationCodes()
      throwOnStatus(res, { 403: forbidden })
      return res.body?.codes ?? []
    },
  })
}

export function useCreateCreationCode() {
  const queryClient = useQueryClient()
  return useMutation({
    // expiresAt is an optional ISO-8601 instant; omit for a code that never expires.
    mutationFn: async ({ expiresAt }: { expiresAt?: string | null } = {}) => {
      const res = await api.CreateCreationCode({ body: { expiresAt: expiresAt ?? undefined } })
      throwOnStatus(res, { 403: forbidden })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.creationCodes }),
  })
}

export function useRevokeCreationCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const res = await api.RevokeCreationCode({ code })
      throwOnStatus(res, {
        409: () => new CreationCodeError('CONSUMED', 'That code was already used and cannot be revoked.'),
        403: forbidden,
        404: () => new CreationCodeError('NOT_FOUND', 'That code no longer exists.'),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.creationCodes }),
  })
}
