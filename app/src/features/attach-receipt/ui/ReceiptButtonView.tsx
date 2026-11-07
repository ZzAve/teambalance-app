import { useRef, useState } from 'react'
import { Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReceiptErrorCode } from '@shared/api/receipts'
import { shrinkImage } from '@shared/lib/crop-photo'
import { cn } from '@shared/lib/utils'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'

interface ReceiptButtonViewProps {
  /** The payee, for the button's label and the dialog. */
  name: string
  /** The amount as shown in the list, for the dialog. */
  amount: string
  /** Set when the expense has a receipt. */
  receiptUrl?: string
  isSaving: boolean
  error?: ReceiptErrorCode
  /** The picked image, shrunk to at most 1600 px and encoded, ready to upload. */
  onPicked: (receipt: Blob) => void
  onRemove: () => void
}

/**
 * The receipt on one expense: an icon button that opens a dialog with the receipt, or with a way to
 * add one. Any member adds, replaces or removes it. Shrinking happens here in the browser, so a phone
 * camera photo fits the server's limit.
 */
export function ReceiptButtonView({ name, amount, receiptUrl, isSaving, error, onPicked, onRemove }: ReceiptButtonViewProps) {
  const { t } = useTranslation()
  const input = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [readFailed, setReadFailed] = useState(false)
  const hasReceipt = receiptUrl !== undefined

  const pick = async (file: File | undefined) => {
    if (input.current) input.current.value = ''
    if (!file) return
    setReadFailed(false)
    try {
      onPicked(await shrinkImage(file))
    } catch {
      setReadFailed(true)
    }
  }

  const message = readFailed ? t('receipt.readFailed') : error && t(`receipt.error.${error}`)

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('receipt.button', { name })}
        className={cn('shrink-0', hasReceipt ? 'text-foreground' : 'text-muted-foreground/50')}
        onClick={() => setOpen(true)}
      >
        <Receipt size={18} aria-hidden="true" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('receipt.title')}</DialogTitle>
            <DialogDescription>{t('receipt.description', { name, amount })}</DialogDescription>
          </DialogHeader>
          {hasReceipt ? (
            <img src={receiptUrl} alt={t('receipt.imageAlt', { name })} className="max-h-[60vh] w-full rounded-md bg-muted object-contain" />
          ) : (
            <p className="text-small text-muted-foreground">{t('receipt.empty')}</p>
          )}
          {message && (
            <p role="alert" className="text-small text-red-ink">
              {message}
            </p>
          )}
          <input
            ref={input}
            type="file"
            accept="image/*"
            aria-label={hasReceipt ? t('receipt.replace') : t('receipt.add')}
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <DialogFooter>
            {hasReceipt && (
              <Button type="button" variant="outline" disabled={isSaving} onClick={onRemove}>
                {t('receipt.remove')}
              </Button>
            )}
            <Button type="button" disabled={isSaving} onClick={() => input.current?.click()}>
              {isSaving ? t('receipt.saving') : hasReceipt ? t('receipt.replace') : t('receipt.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
