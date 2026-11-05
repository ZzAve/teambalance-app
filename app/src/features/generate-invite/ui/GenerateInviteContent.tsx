import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { FormError } from '@shared/ui/FormError'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'

interface GenerateInviteContentProps {
  isLoading: boolean
  isError: boolean
  /** The team's current invite link, or null if it has none. */
  link: string | null
  copied: boolean
  /** The browser refused the clipboard write; the link is still in the field to copy by hand. */
  copyFailed?: boolean
  /** Set only for the moment after an expire, to confirm the link is gone before offering a new one. */
  justExpired: boolean
  isGenerating: boolean
  isRotating: boolean
  isExpiring: boolean
  actionError: boolean
  onCopy: () => void
  onGenerate: () => void
  onRotate: () => void
  onExpire: () => void
}

/**
 * Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
 * no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
 * and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
 * isolation as a story (see GenerateInviteContent.stories.tsx). The outer Dialog chrome (trigger +
 * header) stays in the container; this component owns only its own local confirm-revoke dialog.
 *
 * The no-link state is what the dialog shows instead of silently minting on open: generating is now
 * something the admin asks for, not a side effect of looking (ADR-0025).
 *
 * Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
 * unlike rotate which lands on a new link in the same click.
 */
export function GenerateInviteContent({
  isLoading,
  isError,
  link,
  copied,
  copyFailed,
  justExpired,
  isGenerating,
  isRotating,
  isExpiring,
  actionError,
  onCopy,
  onGenerate,
  onRotate,
  onExpire,
}: GenerateInviteContentProps) {
  const { t } = useTranslation()
  const [confirmRevokeOpen, setConfirmRevokeOpen] = useState(false)
  if (isLoading) return <p className="text-muted-foreground">{t('generateInvite.loading')}</p>
  if (isError) return <p className="text-red-ink">{t('generateInvite.loadFailed')}</p>

  if (justExpired || !link) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-small text-muted-foreground">
          {justExpired
            ? t('generateInvite.revoked')
            : t('generateInvite.noLink')}
        </p>
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? t('generateInvite.generating') : justExpired ? t('generateInvite.generateNew') : t('generateInvite.generate')}
        </Button>
        {actionError && (
          <p className="text-small text-red-ink">{t('generateInvite.actionFailed')}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-muted-foreground">
        {t('generateInvite.share')}
      </p>
      <div className="flex gap-2">
        <Input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
        <Button type="button" onClick={onCopy}>
          {copied ? t('generateInvite.copied') : t('generateInvite.copy')}
        </Button>
      </div>
      {copyFailed && <FormError>{t('generateInvite.copyFailed')}</FormError>}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onRotate} disabled={isRotating}>
          {isRotating ? t('generateInvite.rotating') : t('generateInvite.rotate')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmRevokeOpen(true)}
          disabled={isExpiring}
        >
          {isExpiring ? t('generateInvite.revoking') : t('generateInvite.revoke')}
        </Button>
      </div>
      <p className="text-caption text-muted-foreground">
        {t('generateInvite.explain')}
      </p>
      {actionError && (
        <p className="text-small text-red-ink">{t('generateInvite.actionFailed')}</p>
      )}

      <ConfirmDialog
        open={confirmRevokeOpen}
        title={t('generateInvite.confirmTitle')}
        description={t('generateInvite.confirmDescription')}
        confirmLabel={t('generateInvite.revoke')}
        onConfirm={() => {
          setConfirmRevokeOpen(false)
          onExpire()
        }}
        onCancel={() => setConfirmRevokeOpen(false)}
      />
    </div>
  )
}
