import { createFileRoute } from '@tanstack/react-router'
import { useCurrentMember, useUpdateMember, MemberUpdateError } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

/**
 * Container for the profile screen: wires the current-member query and the update mutation to the
 * presentational EditProfileForm. Handles the loading/error shells; the form itself is network-free.
 */
function ProfilePage() {
  const { data: member, isLoading, error } = useCurrentMember()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()

  const errorCode = updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Profile</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red-500">Couldn't load your profile. Please try again.</p>}

      {member && (
        <div className="mt-4">
          <EditProfileForm
            currentName={member.displayName}
            positions={positions ?? []}
            currentPositionId={member.position?.id ?? null}
            isSaving={updateMember.isPending}
            errorCode={errorCode}
            onSubmit={(name, positionId) =>
              updateMember.mutate({ userId: member.userId, displayName: name, role: member.role, positionId })
            }
          />
        </div>
      )}
    </div>
  )
}
