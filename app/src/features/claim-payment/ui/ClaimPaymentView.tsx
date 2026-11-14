import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserCheck, UserPlus } from 'lucide-react'
import type { PaymentAliasErrorCode } from '@shared/api/payment-aliases'
import { Button } from '@shared/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { Switch } from '@shared/ui/switch'

export interface ClaimRequest {
  userId: string
  useName: boolean
  useIban: boolean
}

interface ClaimPaymentViewProps {
  /** 'member' claims for `userId` (the viewer); 'admin' picks one of `members`. */
  variant: 'member' | 'admin'
  /** The viewer's id, claimed for in the member variant. */
  userId: string
  members?: { userId: string; displayName: string }[]
  /** The payment's name as the pool shows it, and its amount already formatted. */
  name: string
  amount: string
  isSaving?: boolean
  error?: PaymentAliasErrorCode
  /** The shown error is stale: the sheet closed. The container clears it. */
  onDismissError?: () => void
  /** Resolves once the claim is stored, so the sheet closes; rejects on failure, keeping the sheet open. */
  onClaim: (claim: ClaimRequest) => Promise<unknown> | void
}

const SELECT =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-small focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50'

/**
 * "That's mine" (member) and "Assign to…" (Admin) on an unattributed incoming payment (ADR-0046): an
 * icon button that opens a sheet with the two things to remember, the name and the IBAN of the
 * payment. The IBAN never reaches the client, so it is only a switch.
 *
 * The row loses this control once the claim is stored, so after a success focus goes to the row, not to
 * the button that is about to disappear.
 */
export function ClaimPaymentView({ variant, userId, members = [], name, amount, isSaving = false, error, onDismissError, onClaim }: ClaimPaymentViewProps) {
  const { t } = useTranslation()
  const uid = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const claimed = useRef(false)
  // The row, kept before closing: the pool may refetch and unmount this view during the close animation.
  const row = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const [useName, setUseName] = useState(true)
  const [useIban, setUseIban] = useState(true)
  const [picked, setPicked] = useState('')
  const target = variant === 'member' ? userId : picked
  const isAdmin = variant === 'admin'
  const Icon = isAdmin ? UserPlus : UserCheck
  const blocked = target === '' || (!useName && !useIban)
  const hint = target === '' ? 'claim.chooseMember' : !useName && !useIban ? 'claim.chooseParts' : null

  const confirm = async () => {
    try {
      await onClaim({ userId: target, useName, useIban })
    } catch {
      return // the container shows why; what was chosen stays
    }
    claimed.current = true
    row.current = trigger.current?.closest('li') ?? null
    setOpen(false)
  }

  return (
    <>
      <Button
        ref={trigger}
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground"
        aria-label={t(isAdmin ? 'claim.assign' : 'claim.mine', { name })}
        onClick={() => {
          claimed.current = false
          setUseName(true)
          setUseIban(true)
          setPicked('')
          setOpen(true)
        }}
      >
        <Icon size={18} aria-hidden="true" />
      </Button>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next && isSaving) return
          setOpen(next)
          if (!next) onDismissError?.()
        }}
      >
        <SheetContent
          onCloseAutoFocus={(event) => {
            if (!claimed.current) return
            // The button is removed once the pool refetches: land on the row, which stays.
            event.preventDefault()
            row.current?.focus()
          }}
        >
          <SheetHeader>
            <SheetTitle>{t(isAdmin ? 'claim.titleAssign' : 'claim.titleMine')}</SheetTitle>
            <SheetDescription>{t('claim.description', { name, amount })}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-4">
            {isAdmin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-member`} className="text-small font-medium">
                  {t('claim.member')}
                </label>
                <select id={`${uid}-member`} className={SELECT} value={picked} disabled={isSaving} onChange={(e) => setPicked(e.target.value)}>
                  <option value="">{t('claim.memberPlaceholder')}</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 break-words text-small">{t('claim.useName', { name })}</span>
              <Switch checked={useName} onCheckedChange={setUseName} disabled={isSaving} aria-label={t('claim.useName', { name })} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 text-small">
                {t('claim.useIban')}
                <span id={`${uid}-iban-hint`} className="block text-caption text-muted-foreground">
                  {t('claim.ibanHint')}
                </span>
              </span>
              <Switch
                checked={useIban}
                onCheckedChange={setUseIban}
                disabled={isSaving}
                aria-label={t('claim.useIban')}
                aria-describedby={`${uid}-iban-hint`}
              />
            </div>
            {error && (
              <p role="alert" className="rounded-md bg-red/10 px-3 py-2 text-small text-red-ink">
                {t(`claim.error.${error}`)}
              </p>
            )}
            {hint && (
              <p id={`${uid}-hint`} className="text-caption text-muted-foreground">
                {t(hint)}
              </p>
            )}
            <div className="flex gap-2">
              {/* Closes through the Root's onOpenChange, which also clears a shown error. */}
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1" disabled={isSaving}>
                  {t('claim.cancel')}
                </Button>
              </SheetClose>
              <Button
                type="button"
                className="flex-1"
                disabled={isSaving || blocked}
                aria-describedby={hint ? `${uid}-hint` : undefined}
                onClick={confirm}
              >
                {isSaving ? t('claim.saving') : t('claim.confirm')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
