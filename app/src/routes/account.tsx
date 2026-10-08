import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthMe, useLogout } from '@shared/api/auth'
import { endSession } from '@shared/session/session'
import { MemberUpdateError, useCurrentMember, useUpdateMember } from '@entities/member/api/members'
import {
  PhotoError,
  useCopyPersonalPhotoToTeam,
  useRemovePersonalPhoto,
  useUploadPersonalPhoto,
} from '@shared/api/photos'
import { usePositions } from '@entities/position/api/positions'
import { accountSections } from '@features/account/lib/account-sections'
import { AccountView } from '@features/account/ui/AccountView'

/**
 * The team-independent Account tab (ADR-0027 §1). Because it is not under `/t/$slug`, it resolves on
 * every in-shell screen regardless of slug — closing both the teamless and get-started logout gaps —
 * and the root gate allow-lists it (`isTeamlessRoute`) so a teamless caller reaches it here rather
 * than being bounced to onboarding.
 */
export const Route = createFileRoute('/account')({
  component: AccountPage,
})

/**
 * Thin container: reads the session, fetches the current member **only when an Active Team exists**,
 * and wires ThemeToggle (inside AccountView), the member-update mutation, the Personal Photo and
 * logout. Pure wiring —
 * the load/error/data shells live in the props-driven AccountView, so this seam is covered by e2e
 * (Slice 4), not a story.
 *
 * Two guards, together, keep a teamless `/account` from tripping the forced-logout bounce: the
 * member fetch is `enabled: !!activeTeam`, and `/account` is in `TENANT_RESOLVING_PATHS` so a stray
 * 403 is read as "no tenant here yet", not "log out" (ADR-0027 consequences).
 */
function AccountPage() {
  const { data: user } = useAuthMe()
  const activeTeam = user?.activeTeam ?? null

  const { data: member, isLoading: memberLoading, error: memberError } = useCurrentMember({
    enabled: !!activeTeam,
  })
  const { data: positions } = usePositions({ enabled: !!activeTeam })
  const updateMember = useUpdateMember()
  const logout = useLogout()
  const uploadPhoto = useUploadPersonalPhoto()
  const removePhoto = useRemovePersonalPhoto()
  const copyPhoto = useCopyPersonalPhotoToTeam()
  const [offerCopy, setOfferCopy] = useState(false)

  const memberErrorCode =
    updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined

  // The root gate confirms the session before this route renders, so `user` is present; guard
  // defensively for the sliver of time before the cached /me resolves back.
  if (!user) return null

  const photoMutations = [uploadPhoto, removePhoto, copyPhoto]
  const photoError = photoMutations.find((m) => m.isError)?.error
  const resetPhotoErrors = () => photoMutations.forEach((m) => m.reset())

  return (
    <AccountView
      sections={accountSections(user)}
      userId={user.id}
      displayName={user.displayName}
      email={user.email}
      personalPhotoVersion={user.personalPhotoVersion ?? null}
      isPhotoSaving={photoMutations.some((m) => m.isPending)}
      photoErrorMessage={
        photoError ? (photoError instanceof PhotoError ? photoError.message : "Couldn't save the photo. Please try again.") : undefined
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
      activeTeamName={activeTeam?.name ?? null}
      member={member ?? null}
      positions={positions ?? []}
      isMemberLoading={!!activeTeam && memberLoading}
      isMemberError={!!memberError}
      isSaving={updateMember.isPending}
      memberErrorCode={memberErrorCode}
      onSubmitProfile={(name, positionId) => {
        if (!member) return
        updateMember.mutate({
          userId: member.userId,
          displayName: name,
          role: member.role,
          positionId,
          shirtNumber: member.shirtNumber ?? null,
        })
      }}
      // In-shell logout: a clean server-side teardown first, then the shared client clear.
      onLogout={() => logout.mutate(undefined, { onSuccess: () => endSession() })}
    />
  )
}
