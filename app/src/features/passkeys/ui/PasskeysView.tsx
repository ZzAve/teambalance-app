import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Passkey } from '@shared/api/passkeys'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { SectionLabel } from '@shared/ui/SectionLabel'

interface PasskeysViewProps {
  passkeys: Passkey[]
  /** Whether this browser can create passkeys; when not, only a note is shown. */
  supported: boolean
  isLoading?: boolean
  isError?: boolean
  /** A registration is waiting on the device or the server. */
  isAdding?: boolean
  /** A removal is waiting on the server. */
  isRemoving?: boolean
  errorMessage?: string
  onAdd: () => void
  onDelete: (id: string) => void
}

// Same card look as the other Account sections.
const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'

/** The Account tab's passkeys section (ADR-0045): list, add, and remove behind a confirmation. */
export function PasskeysView({
  passkeys,
  supported,
  isLoading = false,
  isError = false,
  isAdding = false,
  isRemoving = false,
  errorMessage,
  onAdd,
  onDelete,
}: PasskeysViewProps) {
  const { t, i18n } = useTranslation()
  const isBusy = isAdding || isRemoving
  const [removingId, setRemovingId] = useState<string | null>(null)
  const date = (iso: string) => new Date(iso).toLocaleDateString(i18n.language)

  return (
    <div>
      <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('passkeys.title')}</SectionLabel>
      <div className={`${CARD} p-4`}>
        <p className="text-small text-muted-foreground">{t('passkeys.hint')}</p>
        {isLoading && <p className="mt-3 text-small text-muted-foreground">{t('account.loading')}</p>}
        {isError && <p className="mt-3 text-small text-red-ink">{t('passkeys.loadFailed')}</p>}
        {!isLoading && !isError && passkeys.length === 0 && (
          <p className="mt-3 text-small text-muted-foreground">{t('passkeys.empty')}</p>
        )}
        {passkeys.length > 0 && (
          <ul className="mt-3 divide-y divide-border">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex items-center gap-3 py-2 text-small">
                <div className="min-w-0">
                  <p className="truncate font-medium">{passkey.label}</p>
                  <p className="text-caption text-muted-foreground">
                    {t('passkeys.added', { date: date(passkey.createdAt) })}
                    {' · '}
                    {passkey.lastUsedAt
                      ? t('passkeys.lastUsed', { date: date(passkey.lastUsedAt) })
                      : t('passkeys.neverUsed')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={isBusy}
                  onClick={() => setRemovingId(passkey.id)}
                >
                  {t('passkeys.remove')}
                </Button>
              </li>
            ))}
          </ul>
        )}
        {supported ? (
          <Button className="mt-3" size="sm" disabled={isBusy} onClick={onAdd}>
            {isAdding ? t('passkeys.adding') : t('passkeys.add')}
          </Button>
        ) : (
          <p className="mt-3 text-small text-muted-foreground">{t('passkeys.unsupported')}</p>
        )}
        {errorMessage && (
          <p role="alert" className="mt-3 text-small text-red-ink">
            {errorMessage}
          </p>
        )}
        <ConfirmDialog
          open={removingId !== null}
          title={t('passkeys.removeTitle')}
          description={t('passkeys.removeHint')}
          confirmLabel={t('passkeys.remove')}
          onConfirm={() => {
            if (removingId !== null) onDelete(removingId)
            setRemovingId(null)
          }}
          onCancel={() => setRemovingId(null)}
        />
      </div>
    </div>
  )
}
