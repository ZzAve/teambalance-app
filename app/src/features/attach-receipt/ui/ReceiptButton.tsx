import { ReceiptError, receiptUrl, useRemoveReceipt, useUploadReceipt } from '@shared/api/receipts'
import { ReceiptButtonView } from './ReceiptButtonView'

interface ReceiptButtonProps {
  paymentId: string
  receiptVersion?: string
  name: string
  amount: string
}

export function ReceiptButton({ paymentId, receiptVersion, name, amount }: ReceiptButtonProps) {
  const upload = useUploadReceipt(paymentId)
  const remove = useRemoveReceipt(paymentId)
  const failure = upload.error ?? remove.error

  return (
    <ReceiptButtonView
      name={name}
      amount={amount}
      receiptUrl={receiptVersion ? receiptUrl(paymentId, receiptVersion) : undefined}
      isSaving={upload.isPending || remove.isPending}
      error={failure ? (failure instanceof ReceiptError ? failure.code : 'FAILED') : undefined}
      onPicked={(receipt) => {
        remove.reset()
        upload.mutate(receipt)
      }}
      onRemove={() => {
        upload.reset()
        remove.mutate()
      }}
    />
  )
}
