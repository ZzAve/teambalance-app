import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { FormError } from '@shared/ui/FormError'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'

interface HandoverAdminViewProps {
  /** The active-admin-link read is in flight. */
  isLoading: boolean
  /** The active-admin-link read failed. */
  isError: boolean
  /** The team's current single-use admin handover link, or null if it has none. */
  link: string | null
  copied: boolean
  /** The browser refused the clipboard write; the link is still in the field to copy by hand. */
  copyFailed?: boolean
  /** Set only for the moment after a revoke, to confirm the link is gone before offering a new one. */
  justRevoked: boolean
  isCreating: boolean
  isRotating: boolean
  isRevoking: boolean
  actionError: boolean
  onCopy: () => void
  onCreate: () => void
  onRotate: () => void
  onRevoke: () => void
}

/**
 * Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
 * dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
 * copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
 * HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).
 *
 * The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
 * rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
 * but this link grants **Admin** and is spent on first accept, so the copy has to say both.
 *
 * Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
 * unlike rotate which lands on a new link in the same click.
 */
export function HandoverAdminView({
  isLoading,
  isError,
  link,
  copied,
  copyFailed,
  justRevoked,
  isCreating,
  isRotating,
  isRevoking,
  actionError,
  onCopy,
  onCreate,
  onRotate,
  onRevoke,
}: HandoverAdminViewProps) {
  const { t } = useTranslation()
  const [confirmRevokeOpen, setConfirmRevokeOpen] = useState(false)
  const heading = (
    <div>
      <h2 className="font-display text-title font-bold">{t('handover.heading')}</h2>
      <p className="mt-1 text-small text-muted-foreground">
        {t('handover.intro')}
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {heading}

      {isLoading && <p className="text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="text-small text-red-ink">{t('handover.loadFailed')}</p>}

      {!isLoading && !isError && justRevoked && (
        <div className="flex flex-col gap-2">
          <p className="text-small text-muted-foreground">
            {t('handover.revoked')}
          </p>
          <Button type="button" onClick={onCreate} disabled={isCreating} className="self-start">
            {isCreating ? t('handover.creating') : t('handover.createNew')}
          </Button>
          {actionError && <p className="text-small text-red-ink">{t('generateInvite.actionFailed')}</p>}
        </div>
      )}

      {!isLoading && !isError && !justRevoked && !link && (
        <div className="flex flex-col gap-2">
          <Button type="button" onClick={onCreate} disabled={isCreating} className="self-start">
            {isCreating ? t('handover.creating') : t('handover.create')}
          </Button>
          {actionError && <p className="text-small text-red-ink">{t('generateInvite.actionFailed')}</p>}
        </div>
      )}

      {!isLoading && !isError && !justRevoked && link && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input aria-label={t('handover.linkLabel')} readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            <Button type="button" onClick={onCopy}>
              {copied ? t('generateInvite.copied') : t('generateInvite.copy')}
            </Button>
          </div>
          {copyFailed && <FormError>{t('generateInvite.copyFailed')}</FormError>}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onRotate} disabled={isRotating}>
              {isRotating ? t('handover.rotating') : t('generateInvite.rotate')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmRevokeOpen(true)}
              disabled={isRevoking}
            >
              {isRevoking ? t('handover.revoking') : t('generateInvite.revoke')}
            </Button>
          </div>
          <p className="text-caption text-muted-foreground">
            {t('handover.hint')}
          </p>
          {actionError && <p className="text-small text-red-ink">{t('generateInvite.actionFailed')}</p>}
        </div>
      )}

      <ConfirmDialog
        open={confirmRevokeOpen}
        title={t('generateInvite.revokeTitle')}
        description={t('handover.revokeDescription')}
        confirmLabel={t('generateInvite.revoke')}
        onConfirm={() => {
          setConfirmRevokeOpen(false)
          onRevoke()
        }}
        onCancel={() => setConfirmRevokeOpen(false)}
      />
    </div>
  )
}
