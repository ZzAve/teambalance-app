import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useCurrentMember, useUpdateMember, MemberUpdateError } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { useLogout } from '@shared/api/auth'
import { useUserStore } from '@shared/stores/user-store'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

/**
 * Log out lives on the Profile page now that the header carries no nav (the tab bar is the primary
 * nav). Same logic as before: clear the session, drop the cached /me, and route to /login.
 */
function LogoutButton() {
  const userId = useUserStore((s) => s.userId)
  const setCurrentUser = useUserStore((s) => s.setCurrentUser)
  const logout = useLogout()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  if (!userId) return null

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setCurrentUser(null)
        queryClient.setQueryData(['auth', 'me'], null)
        navigate({ to: '/login' })
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      Log out
    </button>
  )
}

/**
 * Container for the profile screen: wires the current-member query and the update mutation to the
 * presentational EditProfileForm. Handles the loading/error shells; the form itself is network-free.
 */
function ProfilePage() {
  const { data: member, isLoading, error } = useCurrentMember()
  const { data: positions } = usePositions()
  const updateMember = useUpdateMember()
  const isPlatformAdmin = useUserStore((s) => s.isPlatformAdmin)

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

      {/* Appearance is a personal setting, so it sits on Profile rather than /team/settings (which
          is team-scoped) — same reasoning that put Log out here (F11, #159). Above the admin and
          log-out sections: it applies to every user, they do not. */}
      <div className="mt-10 border-t border-border/40 pt-6">
        <ThemeToggle />
      </div>

      {isPlatformAdmin && (
        <div className="mt-10 border-t border-border/40 pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Platform admin</h3>
          <Link
            to="/admin/creation-codes"
            className="mt-2 inline-block text-sm font-semibold text-blue hover:underline"
          >
            Creation codes
          </Link>
        </div>
      )}

      <div className="mt-10 border-t border-border/40 pt-6">
        <LogoutButton />
      </div>
    </div>
  )
}
