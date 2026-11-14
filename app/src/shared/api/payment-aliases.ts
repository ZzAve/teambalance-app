import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaymentAlias } from './generated/model/PaymentAlias'
import { nullsToUndefined } from './money-pool'
import { ApiError } from './api-error'
import { api } from './wirespec-client'

// Re-export the generated contract types so the app has a single source of truth.
export type { PaymentAlias } from './generated/model/PaymentAlias'
export type { PaymentAliasRequest } from './generated/model/PaymentAliasRequest'

// Why a write failed, so the UI can say which field to fix. 400 without a code is INVALID (nothing
// to store); a 409 without a known code is a name or IBAN another member already uses. NOT_CLAIMABLE
// and POOL_UNAVAILABLE only come from claiming a payment.
export type PaymentAliasErrorCode =
  | 'ALIAS_TAKEN'
  | 'INVALID_IBAN'
  | 'INVALID'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'FAILED'
  | 'NOT_CLAIMABLE'
  | 'POOL_UNAVAILABLE'

export class PaymentAliasError extends ApiError {
  declare readonly code: PaymentAliasErrorCode
  constructor(code: PaymentAliasErrorCode, message: string, status: number) {
    super(status, code, message)
    this.name = 'PaymentAliasError'
  }
}

export function failure(res: { status: number; body?: unknown }): PaymentAliasError {
  const code = (res.body as { code?: string } | undefined)?.code
  if (res.status === 409 && code === 'PAYMENT_NOT_CLAIMABLE') return new PaymentAliasError('NOT_CLAIMABLE', code, res.status)
  if (res.status === 409 && code === 'MONEY_POOL_NOT_READABLE') return new PaymentAliasError('POOL_UNAVAILABLE', code, res.status)
  if (res.status === 503) return new PaymentAliasError('POOL_UNAVAILABLE', 'POOL_UNAVAILABLE', res.status)
  if (res.status === 409) return new PaymentAliasError('ALIAS_TAKEN', code ?? 'PAYMENT_ALIAS_TAKEN', res.status)
  if (res.status === 400) return new PaymentAliasError(code === 'INVALID_IBAN' ? 'INVALID_IBAN' : 'INVALID', code ?? 'INVALID', res.status)
  if (res.status === 403) return new PaymentAliasError('FORBIDDEN', 'FORBIDDEN', res.status)
  if (res.status === 404) return new PaymentAliasError('NOT_FOUND', 'NOT_FOUND', res.status)
  return new PaymentAliasError('FAILED', `Unexpected status ${res.status}`, res.status)
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

/** A part that is on is left out, so the server default applies: with both on, an unusable bank name falls back to the IBAN alone. */
export function claimBody({ userId, useName, useIban }: { userId: string; useName: boolean; useIban: boolean }) {
  return { userId, useName: useName ? undefined : false, useIban: useIban ? undefined : false }
}

/**
 * "That's mine" (ADR-0046): stores an alias for `userId` from the counterparty of a pool payment.
 * The server reads the IBAN from the payment; the client never has it. Refreshes the pool and that
 * member's aliases in the background, so the caller can close its sheet at once.
 */
export function useClaimPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ paymentId, userId, useName, useIban }: { paymentId: string; userId: string; useName: boolean; useIban: boolean }) => {
      const res = await api.claimPayment({ paymentId, body: claimBody({ userId, useName, useIban }) })
      if (res.status !== 201) throw failure(res)
      return res.body
    },
    // Someone else linked it meanwhile: refresh so the row stops offering the claim.
    onError: (error) => {
      if (error instanceof PaymentAliasError && error.code === 'NOT_CLAIMABLE') void queryClient.invalidateQueries({ queryKey: ['money-pool'] })
    },
    onSuccess: (_alias, { userId }) => {
      void queryClient.invalidateQueries({ queryKey: aliasesKey(userId) })
      void queryClient.invalidateQueries({ queryKey: ['money-pool'] })
    },
  })
}
