import { useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'

interface DeleteExpenseViewProps {
  /** What the expense was for, for the button's label and the question. */
  name: string
  /** The amount as shown in the list. */
  amount: string
  isDeleting?: boolean
  onDelete: () => void
}

/** The delete control on one out-of-pocket expense: an icon button that asks before it deletes. */
export function DeleteExpenseView({ name, amount, isDeleting = false, onDelete }: DeleteExpenseViewProps) {
  const { t } = useTranslation()
  const button = useRef<HTMLButtonElement>(null)
  const [asking, setAsking] = useState(false)

  return (
    <>
      <Button
        ref={button}
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('expense.delete.button', { name })}
        className="shrink-0 text-muted-foreground"
        disabled={isDeleting}
        onClick={() => setAsking(true)}
      >
        <Trash2 size={18} aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={asking}
        title={t('expense.delete.title')}
        description={t('expense.delete.description', { name, amount })}
        confirmLabel={t('expense.delete.confirm')}
        onConfirm={() => {
          setAsking(false)
          onDelete()
        }}
        onCancel={() => setAsking(false)}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          button.current?.focus()
        }}
      />
    </>
  )
}
