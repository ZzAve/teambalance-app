import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCurrentUser } from '@shared/api/auth'
import { MemberUpdateError, useMembers, useUpdateMember } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { MemberDetailView } from '@pages/member/ui/MemberDetailView'

export const Route = createFileRoute('/t/$slug/team/$userId')({
  component: MemberDetailPage,
})

/**
 * Container for one Member's page (ADR-0038): reads the roster query the /team page already filled
 * and wires the full-member update. Pure wiring — every state lives in the prop-only View — so this
 * seam is covered by e2e, not a story. Editing is allowed for the member themselves and for Admins;
 * the backend enforces the same rule.
 */
function MemberDetailPage() {
  const { userId } = Route.useParams()
  const currentUser = useCurrentUser()
  const { data: members, isLoading, error } = useMembers()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()
  const [isEditing, setIsEditing] = useState(false)

  const member = members?.find((m) => m.userId === userId)
  const errorCode = updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined

  return (
    <MemberDetailView
      member={member}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      canEdit={currentUser?.id === userId || currentUser?.role === 'ADMIN'}
      isEditing={isEditing}
      isSaving={updateMember.isPending}
      errorCode={errorCode}
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
    />
  )
}
