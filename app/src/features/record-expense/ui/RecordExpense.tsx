import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@shared/api/auth'
import { useMembers } from '@shared/api/members'
import { ExpenseError, useRecordExpense } from '@shared/api/out-of-pocket-expenses'
import { Button } from '@shared/ui/button'
import { readReceiptTotal } from '../lib/read-receipt-total'
import { ExpenseSheetView } from './ExpenseSheetView'

/**
 * Container for recording an out-of-pocket expense: the button and the sheet it opens. A member records
 * for themselves; an Admin picks the member. Pure wiring (ADR-0017), covered by the prop-only sheet's story.
 */
export function RecordExpense({ today }: { today: string }) {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const isAdmin = user?.role === 'ADMIN'
  const members = useMembers().data
  const [open, setOpen] = useState(false)
  const record = useRecordExpense()
  const failure = record.error && (record.error instanceof ExpenseError ? record.error.code : 'FAILED')

  return (
    <ExpenseSheetView
      trigger={
        <Button size="lg" variant="outline">
          {t('expense.button')}
        </Button>
      }
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) record.reset()
      }}
      // Under act-as the viewer is a Platform Admin, not a member of the team: nobody is preselected.
      userId={user && !user.actAs ? user.id : ''}
      members={isAdmin ? (members ?? []) : undefined}
      today={today}
      readTotal={readReceiptTotal}
      isPending={record.isPending}
      // A failed receipt upload closes the sheet (the expense is saved), so it is a toast, not a form error.
      error={failure && failure !== 'RECEIPT_FAILED' ? failure : undefined}
      onSubmit={(expense) =>
        record.mutate(expense, {
          onSuccess: () => {
            setOpen(false)
            toast.success(t('expense.done'))
          },
          onError: (error) => {
            if (!(error instanceof ExpenseError) || error.code !== 'RECEIPT_FAILED') return
            setOpen(false)
            toast.error(t('expense.error.RECEIPT_FAILED'))
          },
        })
      }
    />
  )
}
