import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { currentMemberQueryOptions, useCurrentMember, useCompleteOnboarding, MemberUpdateError } from '@shared/api/members'
import { usePositions } from '@shared/api/positions'
import { queryClient } from '@shared/api/query-client'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'

export const Route = createFileRoute('/get-started/')({
  // A member who has already onboarded has no business here — bounce them home before render.
  // Reads the same cached /members/me the root gate primed (race-free, like the /members gate).
  beforeLoad: async () => {
    let member = null
    try {
      member = await queryClient.ensureQueryData(currentMemberQueryOptions)
    } catch {
      // Session/member unconfirmed — let the root guard handle it; don't block this screen.
    }
    if (member?.onboarded) throw redirect({ to: '/' })
  },
  component: GetStartedPage,
})

/**
 * One-time onboarding screen. Reuses the presentational EditProfileForm (name + required-when-
 * available position), prefilled from the current member, and completes onboarding via
 * useCompleteOnboarding. On success the member is stamped onboarded, so navigating home no longer
 * bounces back here.
 */
function GetStartedPage() {
  const navigate = useNavigate()
  const { data: member, isLoading, error } = useCurrentMember()
  const { data: positions } = usePositions()
  const completeOnboarding = useCompleteOnboarding()

  const errorCode = completeOnboarding.error instanceof MemberUpdateError ? completeOnboarding.error.code : undefined

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="font-display text-2xl font-bold">Welcome to TeamBalance</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Let's set up your profile — tell us your name and where you play.
      </p>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-500">Couldn't load your profile. Please try again.</p>}

      {member && (
        <div className="mt-6">
          <EditProfileForm
            currentName={member.displayName}
            positions={positions ?? []}
            currentPositionId={member.position?.id ?? null}
            isSaving={completeOnboarding.isPending}
            errorCode={errorCode}
            onSubmit={(name, positionId) =>
              completeOnboarding.mutate(
                { displayName: name, role: member.role, positionId },
                { onSuccess: () => navigate({ to: '/' }) },
              )
            }
          />
        </div>
      )}
    </div>
  )
}
