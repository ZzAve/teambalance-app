import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@shared/session/session'
import { MemberUpdateError, useMembers, useUpdateMember } from '@shared/api/members'
import { PhotoError, useCopyPersonalPhotoToTeam, useRemoveTeamPhoto, useUploadTeamPhoto } from '@shared/api/photos'
import { usePositions } from '@shared/api/positions'
import { MemberDetailView } from '@pages/member/ui/MemberDetailView'

export const Route = createFileRoute('/t/$slug/team/$userId')({
  component: MemberDetailPage,
})

/**
 * Container for one Member's page (ADR-0038): reads the roster query the /team page already filled
 * and wires the full-member update. Pure wiring — every state lives in the prop-only View — so this
 * seam is covered by e2e, not a story. Editing is allowed for the member themselves and for Admins;
 * the Team Photo is set only by the member and removed by them or an Admin. The backend enforces the
 * same rules.
 */
function MemberDetailPage() {
  const { userId } = Route.useParams()
  const { user: currentUser, isAdmin } = useSession()
  const { data: members, isLoading, error } = useMembers()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()
  const uploadPhoto = useUploadTeamPhoto()
  const copyPersonalPhoto = useCopyPersonalPhotoToTeam()
  const removePhoto = useRemoveTeamPhoto()
  const [isEditing, setIsEditing] = useState(false)

  const member = members?.find((m) => m.userId === userId)
  const errorCode = updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined
  // NAME_TAKEN and NUMBER_TAKEN sit under their fields; any other failure needs its own message.
  const errorMessage =
    updateMember.isError && errorCode !== 'NAME_TAKEN' && errorCode !== 'NUMBER_TAKEN'
      ? (updateMember.error instanceof MemberUpdateError ? updateMember.error.message : "Couldn't save. Please try again.")
      : undefined
  const photoMutations = [uploadPhoto, copyPersonalPhoto, removePhoto]
  const photoError = photoMutations.find((m) => m.isError)?.error
  // Each photo action clears the others' errors, so only the latest outcome shows.
  const resetPhotoErrors = () => photoMutations.forEach((m) => m.reset())
  const isSelf = currentUser?.id === userId

  return (
    <MemberDetailView
      member={member}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      canEdit={isSelf || isAdmin}
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
      canRemovePhoto={isSelf || isAdmin}
      hasPersonalPhoto={!!currentUser?.personalPhotoVersion}
      isPhotoSaving={photoMutations.some((m) => m.isPending)}
      photoErrorMessage={
        photoError ? (photoError instanceof PhotoError ? photoError.message : "Couldn't save the photo. Please try again.") : undefined
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
    />
  )
}
