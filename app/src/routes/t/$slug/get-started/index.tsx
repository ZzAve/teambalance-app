import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { currentMemberQueryOptions, useCurrentMember, useCompleteOnboarding, MemberUpdateError } from '@entities/member/api/members'
import { useCopyPersonalPhotoToTeam } from '@shared/api/photos'
import { usePositions } from '@entities/position/api/positions'
import { queryClient } from '@shared/api/query-client'
import { useTeamRoutes, teamRoutes } from '@shared/lib/team-routes'
import { GetStartedView } from '@pages/get-started/ui/GetStartedView'

export const Route = createFileRoute('/t/$slug/get-started/')({
  // A member who has already onboarded has no business here — bounce them home before render.
  // Reads the same cached /members/me the root gate primed (race-free, like the /members gate).
  beforeLoad: async ({ params }) => {
    let member = null
    try {
      member = await queryClient.ensureQueryData(currentMemberQueryOptions)
    } catch {
      // Session/member unconfirmed — let the root guard handle it; don't block this screen.
    }
    if (member?.onboarded) throw redirect({ to: teamRoutes(params.slug).events })
  },
  component: GetStartedPage,
})

/**
 * One-time onboarding screen: thin wiring around GetStartedView. Completes onboarding with name,
 * position and Shirt Number, then copies the Personal Photo when the member kept that ticked. On
 * success the member is stamped onboarded, so navigating home no longer bounces back here. A failed
 * copy does not hold them up: the photo can still be set from their page.
 */
function GetStartedPage() {
  const navigate = useNavigate()
  const routes = useTeamRoutes()
  const { data: user } = useAuthMe()
  const { data: member, isLoading, error } = useCurrentMember()
  const { data: positions } = usePositions()
  const completeOnboarding = useCompleteOnboarding()
  const copyPersonalPhoto = useCopyPersonalPhotoToTeam()

  const errorCode = completeOnboarding.error instanceof MemberUpdateError ? completeOnboarding.error.code : undefined

  return (
    <GetStartedView
      member={member}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      isSaving={completeOnboarding.isPending || copyPersonalPhoto.isPending}
      errorCode={errorCode}
      hasPersonalPhoto={!!user?.personalPhotoVersion}
      onSubmit={(displayName, positionId, shirtNumber, usePersonalPhoto) => {
        if (!member) return
        completeOnboarding.mutate(
          { displayName, role: member.role, positionId, shirtNumber },
          {
            onSuccess: async () => {
              if (usePersonalPhoto) await copyPersonalPhoto.mutateAsync().catch(() => undefined)
              navigate({ to: routes.events })
            },
          },
        )
      }}
    />
  )
}
