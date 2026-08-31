import { createFileRoute } from '@tanstack/react-router'
import { useAuthMe, useLogout } from '@shared/api/auth'
import { clearSession } from '@shared/api/clear-session'
import { MemberUpdateError, useCurrentMember, useUpdateMember } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
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
 * and wires ThemeToggle (inside AccountView), the member-update mutation, and logout. Pure wiring —
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

  const memberErrorCode =
    updateMember.error instanceof MemberUpdateError ? updateMember.error.code : undefined

  // The root gate confirms the session before this route renders, so `user` is present; guard
  // defensively for the sliver of time before the cached /me resolves back.
  if (!user) return null

  return (
    <AccountView
      sections={accountSections(user)}
      email={user.email}
      activeTeamName={activeTeam?.name ?? null}
      member={member ?? null}
      positions={positions ?? []}
      isMemberLoading={!!activeTeam && memberLoading}
      isMemberError={!!memberError}
      isSaving={updateMember.isPending}
      memberErrorCode={memberErrorCode}
      onSubmitProfile={(name, positionId) => {
        if (!member) return
        updateMember.mutate({ userId: member.userId, displayName: name, role: member.role, positionId })
      }}
      // In-shell logout: a clean server-side teardown first, then the shared client clear.
      onLogout={() => logout.mutate(undefined, { onSuccess: () => clearSession() })}
    />
  )
}
