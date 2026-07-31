import { MemberUpdateError, useMembers, useRemoveMember, useUpdateMember } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { toggleRole } from '../lib/roster'
import { MemberRosterView } from './MemberRosterView'

/**
 * Container for the admin roster: wires the members query and the update/remove mutations to the
 * presentational MemberRosterView. Pure wiring — the load/error/data shells live in the View
 * (props-driven), so this seam is covered by e2e, not a story. Promote/demote reuses the update
 * mutation with the toggled role and the unchanged display name. See ADR-0017.
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
    <MemberRosterView
      members={members}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      savingUserId={savingUserId}
      errorMessage={activeError?.message ?? null}
      onRename={(userId, displayName) => {
        const member = members?.find((m) => m.userId === userId)
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
  )
}
