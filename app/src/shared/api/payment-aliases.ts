import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaymentAlias } from './generated/model/PaymentAlias'
import { nullsToUndefined } from './money-pool'
import { api } from './wirespec-client'

// Re-export the generated contract types so the app has a single source of truth.
export type { PaymentAlias } from './generated/model/PaymentAlias'
export type { PaymentAliasRequest } from './generated/model/PaymentAliasRequest'

// Why a write failed, so the UI can say which field to fix. 400 without a code is INVALID (nothing
// to store); 409 is always a name or IBAN another member already uses.
export type PaymentAliasErrorCode = 'ALIAS_TAKEN' | 'INVALID_IBAN' | 'INVALID' | 'FORBIDDEN' | 'NOT_FOUND' | 'FAILED'

export class PaymentAliasError extends Error {
  constructor(public readonly code: PaymentAliasErrorCode, message: string) {
    super(message)
    this.name = 'PaymentAliasError'
  }
}

function failure(res: { status: number; body?: unknown }): PaymentAliasError {
  const code = (res.body as { code?: string } | undefined)?.code
  if (res.status === 409) return new PaymentAliasError('ALIAS_TAKEN', code ?? 'PAYMENT_ALIAS_TAKEN')
  if (res.status === 400) return new PaymentAliasError(code === 'INVALID_IBAN' ? 'INVALID_IBAN' : 'INVALID', code ?? 'INVALID')
  if (res.status === 403) return new PaymentAliasError('FORBIDDEN', 'FORBIDDEN')
  if (res.status === 404) return new PaymentAliasError('NOT_FOUND', 'NOT_FOUND')
  return new PaymentAliasError('FAILED', `Unexpected status ${res.status}`)
}

const aliasesKey = (userId: string) => ['payment-aliases', userId] as const

/** The member's aliases. Owner and Admin only (403 for others): render only when the viewer may edit. */
export function usePaymentAliases(userId: string) {
  return useQuery({
    queryKey: aliasesKey(userId),
    queryFn: async (): Promise<PaymentAlias[]> => {
      const res = await api.listPaymentAliases({ userId })
      if (res.status !== 200) throw failure(res)
      return res.body.aliases.map(nullsToUndefined)
    },
  })
}

// An alias write changes which member a payment is attributed to, so the pool refreshes too.
function useRefreshing(userId: string) {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: aliasesKey(userId) }),
      queryClient.invalidateQueries({ queryKey: ['money-pool'] }),
    ])
}

export function useCreatePaymentAlias(userId: string) {
  const refresh = useRefreshing(userId)
  return useMutation({
    mutationFn: async (body: { name?: string; iban?: string }) => {
      const res = await api.createPaymentAlias({ userId, body: { name: body.name, iban: body.iban } })
      if (res.status !== 201) throw failure(res)
      return res.body
    },
    onSuccess: refresh,
  })
}

export function useDeletePaymentAlias(userId: string) {
  const refresh = useRefreshing(userId)
  return useMutation({
    mutationFn: async ({ aliasId }: { aliasId: string }) => {
      const res = await api.deletePaymentAlias({ userId, aliasId })
      if (res.status !== 204) throw failure(res)
    },
    onSuccess: refresh,
  })
}
