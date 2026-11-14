import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useDeleteExpense } from '@shared/api/out-of-pocket-expenses'
import { DeleteExpenseView } from './DeleteExpenseView'

/** Container for deleting one out-of-pocket expense. Pure wiring (ADR-0017) behind the prop-only DeleteExpenseView. */
export function DeleteExpense({ paymentId, name, amount }: { paymentId: string; name: string; amount: string }) {
  const { t } = useTranslation()
  const remove = useDeleteExpense(paymentId)

  return (
    <DeleteExpenseView
      name={name}
      amount={amount}
      isDeleting={remove.isPending}
      onDelete={() =>
        remove.mutate(undefined, {
          onSuccess: () => toast.success(t('expense.delete.done')),
          onError: () => toast.error(t('expense.delete.failed')),
        })
      }
    />
  )
}
