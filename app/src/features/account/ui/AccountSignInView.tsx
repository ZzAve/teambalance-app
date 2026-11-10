import { useState } from 'react'
import { Mail } from 'lucide-react'
import { personalPhotoUrl } from '@shared/api/photos'
import { PhotoPicker } from '@features/pick-photo/ui/PhotoPicker'
import { Passkeys } from '@features/passkeys/ui/Passkeys'
import { Avatar } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { useTranslation } from 'react-i18next'
import { CARD, ICON, ROW } from './account-styles'

interface AccountSignInViewProps {
  userId: string
  /** The platform name, for the initials when there is no Personal Photo. */
  displayName: string
  email: string
  /** Off in the demo build, where guests share one persona (`passkeysOffered`). */
  showPasskeys: boolean
  /** The caller's own Personal Photo (ADR-0038); null when they have none. */
  personalPhotoVersion?: string | null
  isPhotoSaving?: boolean
  photoErrorMessage?: string
  /**
   * Set right after a Personal Photo upload while the Active Team has no Team Photo: the one moment
   * the account offers to copy it into that Team (ADR-0038). Null hides the offer.
   */
  copyPhotoTeamName?: string | null
  onUploadPersonalPhoto?: (photo: Blob) => void
  onRemovePersonalPhoto?: () => void
  onCopyPhotoToTeam?: () => void
  onDismissCopyPhoto?: () => void
}

/**
 * Account → "Account and sign-in": what is the same in every team — email, passkeys and the
 * Personal Photo. Prop-only and presentational; the photo mutations are wired by the route.
 */
export function AccountSignInView({
  userId,
  displayName,
  email,
  showPasskeys,
  personalPhotoVersion,
  isPhotoSaving,
  photoErrorMessage,
  copyPhotoTeamName,
  onUploadPersonalPhoto,
  onRemovePersonalPhoto,
  onCopyPhotoToTeam,
  onDismissCopyPhoto,
}: AccountSignInViewProps) {
  const { t } = useTranslation()
  const [confirmingPhotoRemove, setConfirmingPhotoRemove] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="font-display text-title font-bold">{t('account.signIn')}</h1>
      <p className="text-small text-muted-foreground">{t('account.signInScope')}</p>

      <section>
        <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('account.email')}</SectionLabel>
        <div className={CARD}>
          <div className={ROW}>
            <Mail size={18} strokeWidth={1.9} className={ICON} aria-hidden="true" />
            <span className="min-w-0 truncate" title={email}>{email}</span>
          </div>
        </div>
      </section>

      {showPasskeys && (
        <section>
          <Passkeys />
        </section>
      )}

      <section>
        <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('account.photo')}</SectionLabel>
        <div className={`${CARD} p-4`}>
          <div className="flex items-center gap-4">
            <Avatar
              userId={userId}
              name={displayName}
              size="md"
              photoUrl={personalPhotoVersion ? personalPhotoUrl(personalPhotoVersion) : undefined}
            />
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-small text-muted-foreground">{t('account.photoHint')}</p>
              <div className="flex flex-wrap gap-2">
                <PhotoPicker
                  label={personalPhotoVersion ? t('account.changePhoto') : t('account.uploadPhoto')}
                  disabled={isPhotoSaving}
                  onPicked={(photo) => onUploadPersonalPhoto?.(photo)}
                />
                {personalPhotoVersion && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPhotoSaving}
                    onClick={() => setConfirmingPhotoRemove(true)}
                  >
                    {t('account.removePhoto')}
                  </Button>
                )}
              </div>
            </div>
          </div>
          {photoErrorMessage && <p className="mt-3 text-small text-red-ink">{photoErrorMessage}</p>}
          <ConfirmDialog
            open={confirmingPhotoRemove}
            title={t('account.removePhoto')}
            description={t('account.removePhotoHint')}
            confirmLabel={t('account.remove')}
            onConfirm={() => {
              setConfirmingPhotoRemove(false)
              onRemovePersonalPhoto?.()
            }}
            onCancel={() => setConfirmingPhotoRemove(false)}
          />
          {copyPhotoTeamName && (
            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-small">{t('account.copyQuestion', { team: copyPhotoTeamName })}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" disabled={isPhotoSaving} onClick={onCopyPhotoToTeam}>
                  {t('account.copyConfirm', { team: copyPhotoTeamName })}
                </Button>
                <Button size="sm" variant="ghost" onClick={onDismissCopyPhoto}>
                  {t('account.notNow')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
