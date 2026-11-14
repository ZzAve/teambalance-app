import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@shared/api/auth'
import { useMembers } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { ExpenseError, useDeleteExpense, useUpdateExpense } from '@shared/api/out-of-pocket-expenses'
import { Button } from '@shared/ui/button'
import { ExpenseSheetView } from './ExpenseSheetView'

/**
 * Container for changing or deleting one out-of-pocket expense: the pencil button on its row and the sheet
 * it opens. Rendered by MoneyPool for the member who paid and for an Admin; `amount` is the expense's amount
 * as the list formats it. Pure wiring (ADR-0017), covered by the prop-only sheet's story.
 */
export function EditExpense({ expense, today, amount }: { expense: Payment; today: string; amount: string }) {
  const { t } = useTranslation()
  const isAdmin = useCurrentUser()?.role === 'ADMIN'
  const members = useMembers().data
  const [open, setOpen] = useState(false)
  const update = useUpdateExpense(expense.id)
  const remove = useDeleteExpense(expense.id)
  const failed = update.error ?? remove.error

  return (
    <ExpenseSheetView
      trigger={
        <Button type="button" variant="ghost" size="icon" aria-label={t('expense.editButton', { name: expense.name })} className="shrink-0 text-muted-foreground">
          <Pencil size={18} aria-hidden="true" />
        </Button>
      }
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) return
        update.reset()
        remove.reset()
      }}
      userId={expense.memberId ?? ''}
      members={isAdmin ? (members ?? []) : undefined}
      today={today}
      isPending={update.isPending}
      error={failed ? (failed instanceof ExpenseError ? failed.code : 'FAILED') : undefined}
      editing={{
        amount: expense.amount,
        date: expense.date,
        description: expense.name,
        summary: `${expense.name}, ${amount}`,
        isDeleting: remove.isPending,
        onDelete: () => {
          update.reset()
          remove.mutate(undefined, {
            onSuccess: () => {
              setOpen(false)
              toast.success(t('expense.delete.done'))
            },
          })
        },
      }}
      onSubmit={(changed) => {
        remove.reset()
        update.mutate(changed, {
          onSuccess: () => {
            setOpen(false)
            toast.success(t('expense.changed'))
          },
        })
      }}
    />
  )
}
