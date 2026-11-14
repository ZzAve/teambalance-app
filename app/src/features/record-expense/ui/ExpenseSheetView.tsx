import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExpenseErrorCode, NewExpense } from '@shared/api/out-of-pocket-expenses'
import { shrinkImage } from '@shared/lib/crop-photo'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { formatExpenseAmount, parseExpenseAmount } from '../lib/amount'

const ERROR_CLASS = 'text-small text-red-ink'
const HINT_CLASS = 'text-small text-muted-foreground'
const SELECT =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-small focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50'
const DESCRIPTION_MAX_LENGTH = 100
const PENDING_CLASS = 'aria-disabled:pointer-events-none aria-disabled:opacity-50'

/** The stored expense a form changes, and the way to delete it. */
export interface EditedExpense {
  /** Euro cents. */
  amount: number
  /** ISO calendar date. */
  date: string
  description: string
  /** What the list calls the expense, amount included, for the delete question. */
  summary: string
  onDelete: () => void
  isDeleting?: boolean
}

interface ExpenseFormProps {
  /** The member who paid: fixed when `members` is absent, preselected when it is set; empty for none. */
  userId: string
  /** Set for an Admin, who picks the member who paid. */
  members?: { userId: string; displayName: string }[]
  /** ISO calendar date: the default and the latest date of the expense. */
  today: string
  onSubmit: (expense: NewExpense) => void
  isPending?: boolean
  error?: ExpenseErrorCode
  /**
   * Set to change a stored expense instead of recording a new one. The form then has no receipt part: the
   * receipt is added, replaced and removed with the receipt control in the list.
   */
  editing?: EditedExpense
  /**
   * Reads the total on a receipt photo, in euro cents; null when it finds none. Supplied by the container
   * for a new expense, so this View never loads the text recognition itself.
   */
  readTotal?: (receipt: Blob) => Promise<number | null>
}

interface ExpenseSheetViewProps extends ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The element that opens the sheet; the sheet hands focus back to it on close. */
  trigger?: ReactNode
}

/**
 * The form for an expense a member paid with their own money, new or stored. A new expense starts with a
 * photo of the receipt, from which the amount is read; a save without a photo needs a second, explicit press.
 */
export function ExpenseSheetView({ open, onOpenChange, trigger, ...form }: ExpenseSheetViewProps) {
  const { t } = useTranslation()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{form.editing ? t('expense.editTitle') : t('expense.title')}</SheetTitle>
          <SheetDescription>{t('expense.description')}</SheetDescription>
        </SheetHeader>
        {/* Mounted with the sheet's content, so a closed sheet forgets what was typed. */}
        <ExpenseForm {...form} />
      </SheetContent>
    </Sheet>
  )
}

/** Where the amount in the field came from, for the line under it. */
type TotalReading = 'idle' | 'reading' | 'read' | 'notFound'

function ExpenseForm({ userId, members, today, onSubmit, isPending = false, error, editing, readTotal }: ExpenseFormProps) {
  const { t } = useTranslation()
  const uid = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  // Counts the picked photos, so the total of a photo that was replaced meanwhile is dropped.
  const pickCount = useRef(0)
  const [paidBy, setPaidBy] = useState(userId)
  // fromReceipt: the text is a total read from the receipt, so the total of another photo may replace it.
  const [amountField, setAmountField] = useState({ text: editing ? formatExpenseAmount(editing.amount) : '', fromReceipt: false })
  const amountText = amountField.text
  const [totalReading, setTotalReading] = useState<TotalReading>('idle')
  const [what, setWhat] = useState(editing?.description ?? '')
  const [date, setDate] = useState(editing?.date ?? today)
  const [receipt, setReceipt] = useState<Blob>()
  const [readFailed, setReadFailed] = useState(false)
  const [askingToSkipReceipt, setAskingToSkipReceipt] = useState(false)
  const [askingToDelete, setAskingToDelete] = useState(false)
  const deleteButton = useRef<HTMLButtonElement>(null)

  const preview = useMemo(() => receipt && URL.createObjectURL(receipt), [receipt])
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview])

  const amount = parseExpenseAmount(amountText)
  const amountInvalid = amountText.trim() !== '' && amount === null
  const complete = paidBy !== '' && amount !== null && what.trim() !== '' && date !== '' && date <= today
  // A payer who left the team is not on the roster, but stays the payer unless the Admin picks someone else.
  const formerPayer = members && userId !== '' && !members.some((m) => m.userId === userId)
  const busy = isPending || editing?.isDeleting === true

  const pick = async (file: File | undefined) => {
    if (fileInput.current) fileInput.current.value = ''
    if (!file) return
    setReadFailed(false)
    let picked: Blob
    try {
      picked = await shrinkImage(file)
    } catch {
      setReadFailed(true)
      return
    }
    setReceipt(picked)
    setAskingToSkipReceipt(false)
    if (!readTotal) return
    const thisPick = ++pickCount.current
    setTotalReading('reading')
    const total = await readTotal(picked).catch(() => null)
    if (thisPick !== pickCount.current) return
    setTotalReading(total === null ? 'notFound' : 'read')
    if (total === null) return
    // What the member typed, also while the photo was being read, is never replaced.
    setAmountField((current) => (current.text.trim() === '' || current.fromReceipt ? { text: formatExpenseAmount(total), fromReceipt: true } : current))
  }

  const removeReceipt = () => {
    pickCount.current++
    setReceipt(undefined)
    setTotalReading('idle')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!complete || amount === null || busy) return
    if (!editing && !receipt && !askingToSkipReceipt) {
      setAskingToSkipReceipt(true)
      return
    }
    onSubmit({ userId: paidBy, amount, date, description: what.trim(), receipt })
  }

  const totalLine =
    totalReading === 'reading'
      ? t('expense.total.reading')
      : totalReading === 'notFound'
        ? t('expense.total.notFound')
        : totalReading === 'read' && amountField.fromReceipt
          ? t('expense.total.read')
          : ''

  return (
    <form className="mt-4 flex flex-col gap-4" onSubmit={submit} noValidate>
      {!editing && (
        <div className="flex flex-col gap-2 rounded-lg bg-card p-3">
          <p className="text-small font-medium">{t('expense.receipt')}</p>
          {preview ? (
            <img src={preview} alt={t('expense.receiptAlt')} className="max-h-40 w-full rounded-md bg-muted object-contain" />
          ) : (
            <p className={HINT_CLASS}>{readTotal ? t('expense.receiptHintWithTotal') : t('expense.receiptHint')}</p>
          )}
          {readFailed && (
            <p role="alert" className={ERROR_CLASS}>
              {t('receipt.readFailed')}
            </p>
          )}
          <input ref={fileInput} type="file" accept="image/*" aria-label={t('expense.receiptFile')} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          <div className="flex gap-2">
            <Button type="button" variant={receipt ? 'outline' : 'default'} onClick={() => fileInput.current?.click()}>
              {receipt ? t('receipt.replace') : t('receipt.add')}
            </Button>
            {receipt && (
              <Button type="button" variant="ghost" onClick={removeReceipt}>
                {t('receipt.remove')}
              </Button>
            )}
          </div>
        </div>
      )}

      {members && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${uid}-member`}>{t('expense.paidBy')}</Label>
          <select id={`${uid}-member`} className={SELECT} value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            <option value="">{t('expense.paidByPlaceholder')}</option>
            {formerPayer && <option value={userId}>{t('expense.formerMember')}</option>}
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
          aria-describedby={amountInvalid ? `${uid}-amount-error` : totalLine ? `${uid}-amount-total` : undefined}
          onChange={(e) => setAmountField({ text: e.target.value, fromReceipt: false })}
        />
        {/* Mounted before it has anything to say: a live region added together with its text is not announced. */}
        <div aria-live="polite" aria-atomic="true">
          {amountInvalid ? (
            <p id={`${uid}-amount-error`} className={ERROR_CLASS}>
              {t('expense.amountInvalid')}
            </p>
          ) : (
            totalLine && (
              <p id={`${uid}-amount-total`} className={HINT_CLASS}>
                {totalLine}
              </p>
            )
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
      <Button type="submit" size="lg" disabled={!busy && !complete} aria-disabled={busy} className={PENDING_CLASS}>
        {isPending ? t('expense.saving') : editing ? t('expense.saveChanges') : askingToSkipReceipt && !receipt ? t('expense.saveWithoutReceipt') : t('expense.save')}
      </Button>

      {editing && (
        <>
          <Button
            ref={deleteButton}
            type="button"
            variant="ghost"
            className={`text-red-ink ${PENDING_CLASS}`}
            aria-disabled={busy}
            onClick={() => !busy && setAskingToDelete(true)}
          >
            {editing.isDeleting ? t('expense.delete.deleting') : t('expense.delete.button')}
          </Button>
          <ConfirmDialog
            open={askingToDelete}
            title={t('expense.delete.title')}
            description={t('expense.delete.description', { summary: editing.summary })}
            confirmLabel={t('expense.delete.confirm')}
            onConfirm={() => {
              setAskingToDelete(false)
              editing.onDelete()
            }}
            onCancel={() => setAskingToDelete(false)}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              deleteButton.current?.focus()
            }}
          />
        </>
      )}
    </form>
  )
}
