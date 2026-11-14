import { useMutation, useQueryClient } from '@tanstack/react-query'
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
// description or the date was refused. POOL_UNAVAILABLE: the pool is not connected or Bunq did not answer.
export type ExpenseErrorCode = 'INVALID' | 'FORBIDDEN' | 'NOT_FOUND' | 'POOL_UNAVAILABLE' | 'RECEIPT_FAILED' | 'FAILED'

export class ExpenseError extends Error {
  constructor(public readonly code: ExpenseErrorCode) {
    super(code)
    this.name = 'ExpenseError'
  }
}

function failure(status: number): ExpenseError {
  if (status === 400) return new ExpenseError('INVALID')
  if (status === 403) return new ExpenseError('FORBIDDEN')
  if (status === 404) return new ExpenseError('NOT_FOUND')
  if (status === 409 || status === 503) return new ExpenseError('POOL_UNAVAILABLE')
  return new ExpenseError('FAILED')
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
      } catch {
        throw new ExpenseError('RECEIPT_FAILED')
      }
    },
    // Also after RECEIPT_FAILED: the expense is in the pool by then.
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
