import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCurrentUser } from '@shared/api/auth'
import { MemberUpdateError, useMembers, useRemoveMember, useUpdateMember, type Role } from '@shared/api/members'
import { teamRoutes } from '@shared/lib/team-routes'
import { toggleRole } from '@features/manage-members/lib/roster'
import { PhotoError, personalPhotoUrl, useCopyPersonalPhotoToTeam, useRemoveTeamPhoto, useUploadTeamPhoto } from '@shared/api/photos'
import { usePositions } from '@shared/api/positions'
import { PaymentAliases } from '@features/edit-payment-aliases/ui/PaymentAliases'
import { MemberDetailView } from '@pages/member/ui/MemberDetailView'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/t/$slug/team/$userId')({
  component: MemberDetailPage,
})

/**
 * Container for one Member's page (ADR-0038): reads the roster query the /team page already filled
 * and wires the full-member update. Pure wiring — every state lives in the prop-only View — so this
 * seam is covered by e2e, not a story. Editing is allowed for the member themselves and for Admins;
 * the Team Photo is set only by the member and removed by them or an Admin. An Admin on someone else's
 * page also changes their Position and Role, or removes them (ADR-0013). The backend enforces the
 * same rules, LAST_ADMIN included.
 */
function MemberDetailPage() {
  const { slug, userId } = Route.useParams()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const { data: members, isLoading, error } = useMembers()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()
  // A second instance, so an Admin-group refusal (LAST_ADMIN) does not show up in the profile form.
  const adminUpdate = useUpdateMember()
  const removeMember = useRemoveMember()
  const uploadPhoto = useUploadTeamPhoto()
  const copyPersonalPhoto = useCopyPersonalPhotoToTeam()
  const removePhoto = useRemoveTeamPhoto()
  const [isEditing, setIsEditing] = useState(false)
  const { t } = useTranslation()

  const member = members?.find((m) => m.userId === userId)
  const errorCode = updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined
  // NAME_TAKEN and NUMBER_TAKEN sit under their fields; any other failure needs its own message.
  const errorMessage =
    updateMember.isError && errorCode !== 'NAME_TAKEN' && errorCode !== 'NUMBER_TAKEN'
      ? (updateMember.error instanceof MemberUpdateError ? updateMember.error.message : t('errors.saveFailed'))
      : undefined
  const photoMutations = [uploadPhoto, copyPersonalPhoto, removePhoto]
  const photoError = photoMutations.find((m) => m.isError)?.error
  // Each photo action clears the others' errors, so only the latest outcome shows.
  const resetPhotoErrors = () => photoMutations.forEach((m) => m.reset())
  const isSelf = currentUser?.id === userId
  const adminError = adminUpdate.error ?? removeMember.error
  const adminErrorMessage = adminError
    ? adminError instanceof MemberUpdateError
      ? adminError.message
      : t('errors.saveFailed')
    : undefined
  // The update saves the whole member, so each Admin-group change resends the rest as it is.
  const adminSave = (change: { role?: Role; positionId?: string | null }) => {
    if (!member) return
    removeMember.reset()
    adminUpdate.mutate({
      userId,
      displayName: member.displayName,
      role: change.role ?? member.role,
      positionId: change.positionId !== undefined ? change.positionId : (member.position?.id ?? null),
      shirtNumber: member.shirtNumber ?? null,
    })
  }

  return (
    <MemberDetailView
      member={member}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      canEdit={isSelf || currentUser?.role === 'ADMIN'}
      isEditing={isEditing}
      isSaving={updateMember.isPending}
      errorCode={errorCode}
      errorMessage={errorMessage}
      onEdit={() => {
        updateMember.reset()
        setIsEditing(true)
      }}
      onCancelEdit={() => setIsEditing(false)}
      onSubmit={(displayName, positionId, shirtNumber) => {
        if (!member) return
        updateMember.mutate(
          { userId, displayName, role: member.role, positionId, shirtNumber },
          { onSuccess: () => setIsEditing(false) },
        )
      }}
      canChangePhoto={isSelf}
      canRemovePhoto={isSelf || currentUser?.role === 'ADMIN'}
      personalPhotoUrl={currentUser?.personalPhotoVersion ? personalPhotoUrl(currentUser.personalPhotoVersion) : undefined}
      isPhotoSaving={photoMutations.some((m) => m.isPending)}
      photoErrorMessage={
        photoError ? (photoError instanceof PhotoError ? photoError.message : t('photo.error.FAILED')) : undefined
      }
      onUploadPhoto={(photo) => {
        resetPhotoErrors()
        uploadPhoto.mutate(photo)
      }}
      onUsePersonalPhoto={() => {
        resetPhotoErrors()
        copyPersonalPhoto.mutate()
      }}
      onRemovePhoto={() => {
        resetPhotoErrors()
        removePhoto.mutate(userId)
      }}
      // Aliases only attribute money-pool payments, so a team with the pool off has no use for them.
      paymentAliases={currentUser?.moneyPoolEnabled !== false ? <PaymentAliases userId={userId} /> : undefined}
      canAdminister={!isSelf && currentUser?.role === 'ADMIN'}
      isAdminSaving={adminUpdate.isPending || removeMember.isPending}
      adminErrorMessage={adminErrorMessage}
      onChangePosition={(positionId) => adminSave({ positionId })}
      onToggleRole={() => member && adminSave({ role: toggleRole(member.role) })}
      onRemove={() => {
        adminUpdate.reset()
        removeMember.mutate({ userId }, { onSuccess: () => navigate({ to: teamRoutes(slug).team }) })
      }}
    />
  )
}
