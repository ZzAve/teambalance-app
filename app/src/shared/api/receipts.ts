import { useMutation, useQueryClient } from '@tanstack/react-query'
import { csrfHeaders } from './csrf'
import { moneyPoolQueryOptions } from './money-pool'

// Receipts travel as image bytes, outside the generated client, like photos (ADR-0038). The pool's
// `Payment.receiptVersion` goes into the URL, so a cached image is replaced when the receipt changes.
const baseUrl = () => import.meta.env.VITE_API_URL ?? ''
const receiptPath = (paymentId: string) => `/api/team/money-pool/payments/${encodeURIComponent(paymentId)}/receipt`

export const receiptUrl = (paymentId: string, version: string) =>
  `${baseUrl()}${receiptPath(paymentId)}?v=${encodeURIComponent(version)}`

export type ReceiptErrorCode = 'RECEIPT_TOO_LARGE' | 'INVALID_RECEIPT' | 'EXPENSE_NOT_FOUND' | 'FAILED'

export class ReceiptError extends Error {
  constructor(public readonly code: ReceiptErrorCode) {
    super(code)
    this.name = 'ReceiptError'
  }
}

async function sendReceipt(method: 'PUT' | 'DELETE', paymentId: string, body?: Blob) {
  const res = await fetch(`${baseUrl()}${receiptPath(paymentId)}`, {
    method,
    credentials: 'include',
    headers: { ...(body ? { 'Content-Type': body.type } : {}), ...csrfHeaders(method) },
    body,
  })
  if (res.ok) return
  const code = await res
    .json()
    .then((json: { code?: string }) => json.code)
    .catch(() => undefined)
  if (code === 'RECEIPT_TOO_LARGE' || code === 'INVALID_RECEIPT') throw new ReceiptError(code)
  throw new ReceiptError(res.status === 404 ? 'EXPENSE_NOT_FOUND' : 'FAILED')
}

// The receipt's version rides on the pool.
function useReceiptMutation<T = void>(request: (input: T) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moneyPoolQueryOptions.queryKey }),
  })
}

export const useUploadReceipt = (paymentId: string) =>
  useReceiptMutation((receipt: Blob) => sendReceipt('PUT', paymentId, receipt))

export const useRemoveReceipt = (paymentId: string) => useReceiptMutation(() => sendReceipt('DELETE', paymentId))
