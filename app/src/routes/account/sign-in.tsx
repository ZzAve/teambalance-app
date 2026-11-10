import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { useCurrentMember } from '@shared/api/members'
import { passkeysOffered } from '@shared/api/passkeys'
import {
  PhotoError,
  useCopyPersonalPhotoToTeam,
  useRemovePersonalPhoto,
  useUploadPersonalPhoto,
} from '@shared/api/photos'
import { ACCOUNT_PATH } from '@shared/lib/team-routes'
import { AccountSignInView } from '@features/account/ui/AccountSignInView'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { useTranslation } from 'react-i18next'

/** Account → "Account and sign-in". Team-independent like `/account`, and allow-listed with it. */
export const Route = createFileRoute('/account/sign-in')({
  component: AccountSignInPage,
})

/**
 * Thin container for the email, passkeys and Personal Photo screen. The member fetch only decides
 * whether to offer copying a fresh upload into the Active Team (ADR-0038), so it is held off without
 * one: a teamless fetch 403s NO_TEAM_MEMBERSHIP, and this path is in `TENANT_RESOLVING_PATHS` too.
 */
function AccountSignInPage() {
  const { data: user } = useAuthMe()
  const activeTeam = user?.activeTeam ?? null
  const { data: member } = useCurrentMember({ enabled: !!activeTeam })
  const uploadPhoto = useUploadPersonalPhoto()
  const removePhoto = useRemovePersonalPhoto()
  const copyPhoto = useCopyPersonalPhotoToTeam()
  const { t } = useTranslation()
  const [offerCopy, setOfferCopy] = useState(false)

  if (!user) return null

  const photoMutations = [uploadPhoto, removePhoto, copyPhoto]
  const photoError = photoMutations.find((m) => m.isError)?.error
  const resetPhotoErrors = () => photoMutations.forEach((m) => m.reset())

  return (
    <>
      <PageHeader title={t('account.signIn')} backTo={ACCOUNT_PATH} backLabel={t('account.backToAccount')} />
      <AccountSignInView
        userId={user.id}
        displayName={user.displayName}
        email={user.email}
        showPasskeys={passkeysOffered()}
        personalPhotoVersion={user.personalPhotoVersion ?? null}
        isPhotoSaving={photoMutations.some((m) => m.isPending)}
        photoErrorMessage={
          photoError ? t(`photo.error.${photoError instanceof PhotoError ? photoError.code : 'FAILED'}`) : undefined
        }
        copyPhotoTeamName={offerCopy && activeTeam ? activeTeam.name : null}
        onUploadPersonalPhoto={(photo) => {
          resetPhotoErrors()
          setOfferCopy(false)
          // Offered once, right after the upload, and only while this Team shows initials (ADR-0038).
          uploadPhoto.mutate(photo, { onSuccess: () => setOfferCopy(!!member && !member.photoVersion) })
        }}
        onRemovePersonalPhoto={() => {
          resetPhotoErrors()
          setOfferCopy(false)
          removePhoto.mutate()
        }}
        onCopyPhotoToTeam={() => {
          resetPhotoErrors()
          copyPhoto.mutate(undefined, { onSuccess: () => setOfferCopy(false) })
        }}
        onDismissCopyPhoto={() => setOfferCopy(false)}
      />
    </>
  )
}
