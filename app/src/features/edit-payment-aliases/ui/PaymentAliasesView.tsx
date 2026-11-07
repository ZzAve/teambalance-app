import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Landmark, Plus, Tag } from 'lucide-react'
import type { Payment } from '@shared/api/money-pool'
import type { PaymentAlias } from '@shared/api/payment-aliases'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { Skeleton } from '@shared/ui/skeleton'
import { matchingPayments } from '../lib/matching-payments'
import { checkIban, groupIban, normaliseIban } from '../lib/validate-iban'

export type PaymentAliasErrorCode = 'ALIAS_TAKEN' | 'INVALID_IBAN' | 'INVALID' | 'FORBIDDEN' | 'NOT_FOUND' | 'FAILED'

interface PaymentAliasesViewProps {
  aliases?: PaymentAlias[]
  /** The money-pool payments the viewer can already see, for the "matches N payments" preview. */
  payments?: Payment[]
  isLoading?: boolean
  isError?: boolean
  isSaving?: boolean
  /** Why the last save or remove failed (from the container); shown above the form or list. */
  errorCode?: PaymentAliasErrorCode | null
  onRetry?: () => void
  /** The shown error is stale: a field was edited or the form closed. The container clears it. */
  onDismissError?: () => void
  /** Resolves once saved, so the form can reset; rejects on failure, keeping what was typed. */
  onCreate: (alias: { name?: string; iban?: string }) => Promise<unknown> | void
  onDelete: (alias: PaymentAlias) => void
}

const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
const HINT = 'text-caption text-muted-foreground'

const lastFour = (masked: string) => masked.replace(/\s+/g, '').slice(-4)

/**
 * How a member shows up on Bunq payments (ADR-0045), on the member page: a name and/or an IBAN that
 * attribute incoming payments to them. Starts as two fields; once one alias exists it is a list with
 * Remove and an "Add a name or IBAN" button. The IBAN is write-only: the list only ever shows what the
 * API returns, the masked form. Prop-only; the container owns the queries and mutations.
 */
export function PaymentAliasesView({
  aliases = [],
  payments = [],
  isLoading,
  isError,
  isSaving,
  errorCode,
  onRetry,
  onDismissError,
  onCreate,
  onDelete,
}: PaymentAliasesViewProps) {
  const { t } = useTranslation()
  const [adding, setAdding] = useState(false)
  const showForm = aliases.length === 0 || adding
  const root = useRef<HTMLElement>(null)
  // Where focus goes once the control that held it is gone: the Add button, or the next row's Remove
  // (then Add, or the name field when the last alias went). Waits while a request is in flight.
  const [focusNext, setFocusNext] = useState<{ remove?: string; orForm?: boolean } | null>(null)
  useEffect(() => {
    if (!focusNext || isSaving) return
    const find = (sel: string) => root.current?.querySelector<HTMLElement>(sel)
    const target =
      (focusNext.remove && find(`[data-alias-remove="${focusNext.remove}"]`)) ||
      find('[data-alias-add]') ||
      (focusNext.orForm ? find('[data-alias-name]') : null)
    if (target) {
      target.focus()
      setFocusNext(null)
    }
  }, [focusNext, isSaving, aliases, adding])

  return (
    <section ref={root} aria-label={t('paymentAliases.heading')}>
      <SectionLabel as="h3" className="mb-2 px-1 text-small">
        {t('paymentAliases.heading')}
      </SectionLabel>

      {isLoading && (
        <div className={`${CARD} flex flex-col gap-3 p-4`} aria-busy="true">
          <span className="sr-only">{t('paymentAliases.loading')}</span>
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      )}

      {isError && (
        <div className={`${CARD} flex flex-col items-start gap-3 p-4`} role="alert">
          <div>
            <p className="font-medium">{t('paymentAliases.loadFailed')}</p>
            <p className="mt-1 text-small text-muted-foreground">{t('paymentAliases.loadFailedHint')}</p>
          </div>
          {onRetry && <Button onClick={onRetry}>{t('shell.retry')}</Button>}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className={CARD}>
            {aliases.length > 0 && (
              <ul className="divide-y divide-border">
                {aliases.map((alias) => (
                  <AliasRow
                    key={alias.id}
                    alias={alias}
                    payments={payments}
                    disabled={isSaving}
                    onDelete={(a) => {
                      const next = aliases[aliases.findIndex((x) => x.id === a.id) + 1]
                      setFocusNext({ remove: next?.id, orForm: true })
                      onDelete(a)
                    }}
                  />
                ))}
              </ul>
            )}
            {showForm ? (
              <AliasForm
                first={aliases.length === 0}
                payments={payments}
                isSaving={isSaving}
                errorCode={errorCode}
                onCreate={onCreate}
                onDismissError={onDismissError}
                onSaved={() => {
                  setAdding(false)
                  setFocusNext({})
                }}
                onCancel={() => {
                  onDismissError?.()
                  setAdding(false)
                  setFocusNext({})
                }}
              />
            ) : (
              <div className="border-t border-border px-4 pb-4 pt-3">
                {errorCode && <ErrorMessage code={errorCode} />}
                <Button variant="outline" className="w-full" data-alias-add onClick={() => setAdding(true)}>
                  <Plus size={16} aria-hidden="true" />
                  {t('paymentAliases.add')}
                </Button>
              </div>
            )}
          </div>
          <p className={`${HINT} mx-1 mt-2`}>{t('paymentAliases.privacy')}</p>
        </>
      )}
    </section>
  )
}

function ErrorMessage({ code }: { code: PaymentAliasErrorCode }) {
  const { t } = useTranslation()
  return (
    <p role="alert" className="mb-3 rounded-md bg-red/10 px-3 py-2 text-small text-red-ink">
      {t(`paymentAliases.error.${code}`)}
    </p>
  )
}

function AliasRow({
  alias,
  payments,
  disabled,
  onDelete,
}: {
  alias: PaymentAlias
  payments: Payment[]
  disabled?: boolean
  onDelete: (alias: PaymentAlias) => void
}) {
  const { t } = useTranslation()
  const label = alias.name ?? alias.ibanMasked ?? ''
  const matches = alias.name ? matchingPayments(alias.name, payments).count : 0
  return (
    <li className="flex min-h-14 items-center gap-3 px-4 py-3 text-small">
      {alias.name ? (
        <Tag size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      ) : (
        <Landmark size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{alias.name ?? t('paymentAliases.ibanOnly')}</span>
        {alias.ibanMasked && (
          <span className="block truncate font-mono text-muted-foreground">
            <span className="sr-only">{t('paymentAliases.ibanEnding', { last: lastFour(alias.ibanMasked) })}</span>
            <span aria-hidden="true">{alias.ibanMasked}</span>
          </span>
        )}
        {matches > 0 && (
          <span className={`${HINT} block`}>{t('paymentAliases.matches', { count: matches })}</span>
        )}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        data-alias-remove={alias.id}
        aria-label={t('paymentAliases.removeLabel', { label })}
        onClick={() => onDelete(alias)}
      >
        {t('paymentAliases.remove')}
      </Button>
    </li>
  )
}

function AliasForm({
  first,
  payments,
  isSaving,
  errorCode,
  onCreate,
  onDismissError,
  onSaved,
  onCancel,
}: {
  first: boolean
  payments: Payment[]
  isSaving?: boolean
  errorCode?: PaymentAliasErrorCode | null
  onCreate: PaymentAliasesViewProps['onCreate']
  onDismissError?: () => void
  onSaved: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [iban, setIban] = useState('')
  const uid = useId()

  const check = checkIban(iban)
  const trimmedName = name.trim()
  const hasPart = trimmedName !== '' || check.state !== 'empty'
  const canSave = hasPart && (check.state === 'empty' || check.state === 'valid') && !isSaving
  const preview = trimmedName === '' ? null : matchingPayments(trimmedName, payments).count
  // The server's verdict on the IBAN counts as an error too, until the field is edited.
  const serverRejected = errorCode === 'INVALID_IBAN'
  const ibanInvalid = check.state === 'error' || serverRejected
  // Only the verdict is announced; the per-keystroke hints are not.
  const status = ibanInvalid
    ? t(`paymentAliases.iban.${check.state === 'error' ? check.reason : 'checksum'}`)
    : check.state === 'valid'
      ? t('paymentAliases.iban.valid')
      : ''
  const hint =
    status !== ''
      ? null
      : check.state === 'typing' && check.remaining
        ? t('paymentAliases.iban.remaining', { count: check.remaining })
        : t('paymentAliases.iban.hint')

  const save = async () => {
    if (!canSave) return
    try {
      await onCreate({
        name: trimmedName === '' ? undefined : trimmedName,
        iban: check.state === 'valid' ? normaliseIban(iban) : undefined,
      })
      setName('')
      setIban('')
      onSaved()
    } catch {
      // The container shows why through errorCode; the fields keep their values.
    }
  }

  return (
    <form
      className={`flex flex-col gap-4 p-4 ${first ? '' : 'border-t border-border'}`}
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
    >
      {first && <p className="text-small text-muted-foreground">{t('paymentAliases.intro')}</p>}
      {errorCode && errorCode !== 'INVALID_IBAN' && <ErrorMessage code={errorCode} />}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-name`} className="text-small font-medium">
          {t('paymentAliases.nameLabel')}
        </label>
        <Input
          id={`${uid}-name`}
          data-alias-name
          value={name}
          autoComplete="off"
          onChange={(e) => {
            onDismissError?.()
            setName(e.target.value)
          }}
          aria-describedby={`${uid}-name-hint`} />
        <p id={`${uid}-name-hint`} className={HINT}>
          {t('paymentAliases.nameHint')}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-iban`} className="text-small font-medium">
          {t('paymentAliases.ibanLabel')}
        </label>
        <Input
          id={`${uid}-iban`}
          className="font-mono"
          value={iban}
          autoComplete="off"
          spellCheck={false}
          // shortcut: re-grouping moves the caret to the end when editing mid-string, fine for typing or pasting
          onChange={(e) => {
            onDismissError?.()
            setIban(groupIban(e.target.value))
          }}
          aria-invalid={ibanInvalid}
          aria-describedby={`${uid}-iban-msg`}
        />
        <div id={`${uid}-iban-msg`}>
          <p aria-live="polite" className={ibanInvalid ? 'text-small text-red-ink' : 'text-small text-green'}>
            {status}
          </p>
          {hint && <p className={HINT}>{hint}</p>}
        </div>
      </div>
      <p className="text-small empty:hidden" aria-live="polite">
        {preview === null ? '' : t('paymentAliases.preview', { count: preview })}
      </p>
      <div className="flex gap-2">
        <Button type="submit" disabled={!canSave}>
          {t('paymentAliases.save')}
        </Button>
        {!first && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('paymentAliases.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
