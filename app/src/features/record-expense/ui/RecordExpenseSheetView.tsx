import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExpenseErrorCode, NewExpense } from '@shared/api/out-of-pocket-expenses'
import { shrinkImage } from '@shared/lib/crop-photo'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { parseExpenseAmount } from '../lib/amount'

const ERROR_CLASS = 'text-small text-red-ink'
const SELECT =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-small focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50'
const DESCRIPTION_MAX_LENGTH = 100

interface ExpenseFormProps {
  /** The member the expense is recorded for when `members` is absent, and the one preselected when it is set; empty for none. */
  userId: string
  /** Set for an Admin, who picks the member who paid. */
  members?: { userId: string; displayName: string }[]
  /** ISO calendar date: the default and the latest date of the expense. */
  today: string
  onSubmit: (expense: NewExpense) => void
  isPending?: boolean
  error?: ExpenseErrorCode
}

interface RecordExpenseSheetViewProps extends ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The element that opens the sheet; the sheet hands focus back to it on close. */
  trigger?: ReactNode
}

/**
 * The form for an expense a member paid with their own money. It asks for a photo of the receipt: a
 * save without one needs a second, explicit press.
 */
export function RecordExpenseSheetView({ open, onOpenChange, trigger, ...form }: RecordExpenseSheetViewProps) {
  const { t } = useTranslation()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('expense.title')}</SheetTitle>
          <SheetDescription>{t('expense.description')}</SheetDescription>
        </SheetHeader>
        {/* Mounted with the sheet's content, so a closed sheet forgets what was typed. */}
        <ExpenseForm {...form} />
      </SheetContent>
    </Sheet>
  )
}

function ExpenseForm({ userId, members, today, onSubmit, isPending = false, error }: ExpenseFormProps) {
  const { t } = useTranslation()
  const uid = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const [paidBy, setPaidBy] = useState(userId)
  const [amountText, setAmountText] = useState('')
  const [what, setWhat] = useState('')
  const [date, setDate] = useState(today)
  const [receipt, setReceipt] = useState<Blob>()
  const [readFailed, setReadFailed] = useState(false)
  const [askingToSkipReceipt, setAskingToSkipReceipt] = useState(false)

  const preview = useMemo(() => receipt && URL.createObjectURL(receipt), [receipt])
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview])

  const amount = parseExpenseAmount(amountText)
  const amountInvalid = amountText.trim() !== '' && amount === null
  const complete = paidBy !== '' && amount !== null && what.trim() !== '' && date !== '' && date <= today

  const pick = async (file: File | undefined) => {
    if (fileInput.current) fileInput.current.value = ''
    if (!file) return
    setReadFailed(false)
    try {
      setReceipt(await shrinkImage(file))
      setAskingToSkipReceipt(false)
    } catch {
      setReadFailed(true)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!complete || amount === null || isPending) return
    if (!receipt && !askingToSkipReceipt) {
      setAskingToSkipReceipt(true)
      return
    }
    onSubmit({ userId: paidBy, amount, date, description: what.trim(), receipt })
  }

  return (
    <form className="mt-4 flex flex-col gap-4" onSubmit={submit} noValidate>
      {members && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${uid}-member`}>{t('expense.paidBy')}</Label>
          <select id={`${uid}-member`} className={SELECT} value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            <option value="">{t('expense.paidByPlaceholder')}</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.displayName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${uid}-amount`}>{t('expense.amount')}</Label>
        <Input
          id={`${uid}-amount`}
          inputMode="decimal"
          value={amountText}
          placeholder="12,50"
          aria-invalid={amountInvalid}
          aria-describedby={amountInvalid ? `${uid}-amount-error` : undefined}
          onChange={(e) => setAmountText(e.target.value)}
        />
        {/* Mounted before it has anything to say: a live region added together with its text is not announced. */}
        <div aria-live="polite" aria-atomic="true">
          {amountInvalid && (
            <p id={`${uid}-amount-error`} className={ERROR_CLASS}>
              {t('expense.amountInvalid')}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${uid}-what`}>{t('expense.what')}</Label>
        <Input id={`${uid}-what`} value={what} maxLength={DESCRIPTION_MAX_LENGTH} placeholder={t('expense.whatPlaceholder')} onChange={(e) => setWhat(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${uid}-date`}>{t('expense.date')}</Label>
        <Input id={`${uid}-date`} type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-card p-3">
        <p className="text-small font-medium">{t('expense.receipt')}</p>
        {preview ? (
          <img src={preview} alt={t('expense.receiptAlt')} className="max-h-40 w-full rounded-md bg-muted object-contain" />
        ) : (
          <p className="text-small text-muted-foreground">{t('expense.receiptHint')}</p>
        )}
        {readFailed && (
          <p role="alert" className={ERROR_CLASS}>
            {t('receipt.readFailed')}
          </p>
        )}
        <input ref={fileInput} type="file" accept="image/*" aria-label={t('expense.receiptFile')} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
            {receipt ? t('receipt.replace') : t('receipt.add')}
          </Button>
          {receipt && (
            <Button type="button" variant="ghost" onClick={() => setReceipt(undefined)}>
              {t('receipt.remove')}
            </Button>
          )}
        </div>
      </div>

      {/* Mounted before it has anything to say, like the amount error. */}
      <div aria-live="polite" aria-atomic="true">
        {askingToSkipReceipt && !receipt && <p className="text-small font-medium">{t('expense.noReceiptQuestion')}</p>}
      </div>

      {error && (
        <p role="alert" className={ERROR_CLASS}>
          {t(`expense.error.${error}`)}
        </p>
      )}

      {/* Pending is aria-disabled, not disabled: a focused button that becomes disabled drops focus to <body>,
          outside the modal sheet. The guard in submit makes it inert. */}
      <Button
        type="submit"
        size="lg"
        disabled={!isPending && !complete}
        aria-disabled={isPending}
        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        {isPending ? t('expense.saving') : askingToSkipReceipt && !receipt ? t('expense.saveWithoutReceipt') : t('expense.save')}
      </Button>
    </form>
  )
}
