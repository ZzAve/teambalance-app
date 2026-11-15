import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from './api-error'
import { moneyPoolQueryOptions } from './money-pool'
import { uploadReceipt } from './receipts'
import { api } from './wirespec-client'

// An expense a member paid with their own money (ADR-0048). The pool lists it among the payments.

export interface NewExpense {
  /** The member who paid. */
  userId: string
  /** Euro cents. */
  amount: number
  /** ISO calendar date. */
  date: string
  description: string
  /** Shrunk and encoded, ready to upload. */
  receipt?: Blob
}

// RECEIPT_FAILED: the expense is saved, the upload of its receipt is not. INVALID: the amount, the
// description or the date was refused. POOL_OFF: the money pool is switched off for the team.
export type ExpenseErrorCode = 'INVALID' | 'FORBIDDEN' | 'NOT_FOUND' | 'POOL_OFF' | 'RECEIPT_FAILED' | 'FAILED'

export class ExpenseError extends ApiError {
  declare readonly code: ExpenseErrorCode
  constructor(code: ExpenseErrorCode, status: number) {
    super(status, code, code)
    this.name = 'ExpenseError'
  }
}

const CODE_OF_STATUS: Record<number, ExpenseErrorCode> = { 400: 'INVALID', 403: 'FORBIDDEN', 404: 'NOT_FOUND', 409: 'POOL_OFF' }

function failure(status: number): ExpenseError {
  return new ExpenseError(CODE_OF_STATUS[status] ?? 'FAILED', status)
}

export function useRecordExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ receipt, ...body }: NewExpense) => {
      const res = await api.recordOutOfPocketExpense({ body })
      if (res.status !== 201) throw failure(res.status)
      if (!receipt) return
      try {
        await uploadReceipt(res.body.id, receipt)
      } catch (error) {
        // The status of the refused upload; 0 when the request did not get an answer.
        throw new ExpenseError('RECEIPT_FAILED', error instanceof ApiError ? error.status : 0)
      }
    },
    // Also after RECEIPT_FAILED: the expense is in the pool by then.
    onSettled: () => queryClient.invalidateQueries({ queryKey: moneyPoolQueryOptions.queryKey }),
  })
}

/** Replaces everything but the receipt, which the receipt control in the list changes. */
export function useUpdateExpense(paymentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, amount, date, description }: NewExpense) => {
      const res = await api.updateOutOfPocketExpense({ paymentId, body: { userId, amount, date, description } })
      if (res.status !== 200) throw failure(res.status)
    },
    // After a 404 too: someone else deleted it.
    onSettled: () => queryClient.invalidateQueries({ queryKey: moneyPoolQueryOptions.queryKey }),
  })
}

export function useDeleteExpense(paymentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.deleteOutOfPocketExpense({ paymentId })
      if (res.status !== 204) throw failure(res.status)
    },
    // After a 404 too: someone else deleted it.
    onSettled: () => queryClient.invalidateQueries({ queryKey: moneyPoolQueryOptions.queryKey }),
  })
}
