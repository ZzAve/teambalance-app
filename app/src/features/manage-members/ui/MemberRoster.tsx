import { MemberUpdateError, useMembers, useRemoveMember, useUpdateMember } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { toggleRole } from '../lib/roster'
import { MemberRosterView } from './MemberRosterView'

/**
 * Container for the admin roster: wires the members query and the update/remove mutations to the
 * presentational MemberRosterView, and handles the loading/error shells. Promote/demote reuses the
 * update mutation with the toggled role and the unchanged display name.
 */
export function MemberRoster() {
  const { data: members, isLoading, error } = useMembers()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()
  const removeMember = useRemoveMember()

  const activeError =
    updateMember.error instanceof MemberUpdateError
      ? updateMember.error
      : removeMember.error instanceof MemberUpdateError
        ? removeMember.error
        : null

  const savingUserId = updateMember.isPending
    ? updateMember.variables?.userId
    : removeMember.isPending
      ? removeMember.variables?.userId
      : null

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Members</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red-500">Couldn't load members. Please try again.</p>}

      {members && (
        <div className="mt-4">
          <MemberRosterView
            members={members}
            positions={positions ?? []}
            savingUserId={savingUserId}
            errorMessage={activeError?.message ?? null}
            onRename={(userId, displayName) => {
              const member = members.find((m) => m.userId === userId)
              if (member)
                updateMember.mutate({ userId, displayName, role: member.role, positionId: member.position?.id ?? null })
            }}
            onToggleRole={(member) =>
              updateMember.mutate({
                userId: member.userId,
                displayName: member.displayName,
                role: toggleRole(member.role),
                positionId: member.position?.id ?? null,
              })
            }
            onChangePosition={(member, positionId) =>
              updateMember.mutate({ userId: member.userId, displayName: member.displayName, role: member.role, positionId })
            }
            onRemove={(member) => removeMember.mutate({ userId: member.userId })}
          />
        </div>
      )}
    </div>
  )
}
