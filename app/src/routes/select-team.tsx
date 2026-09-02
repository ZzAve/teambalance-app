import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'
import { queryClient } from '@shared/api/query-client'
import { authMeQueryOptions } from '@shared/api/auth'
import { teamsRouteRedirect } from '@features/switch-team/lib/teams-route-guard'
import { TeamsView } from '@features/switch-team/ui/TeamsView'

/**
 * The Teams "main view" (ADR-0027 §4) — the fuller entry point the Account tab's Teams row opens:
 * switch between your teams, or join / create another. Reachable *with* an Active Team set; only a
 * truly teamless caller is sent on to the unchanged `/onboarding` (see {@link teamsRouteRedirect}).
 * Picking a team is an ordinary navigation to `/t/:slug`, whose gate performs the switch.
 */
export const Route = createFileRoute('/select-team')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    const to = teamsRouteRedirect(user)
    if (to) throw redirect({ to })
  },
  component: SelectTeamPage,
})

function SelectTeamPage() {
  const navigate = useNavigate()
  const { data: user } = useAuthMe()

  return (
    <TeamsView
      teams={user?.teams ?? []}
      activeTeam={user?.activeTeam ?? null}
      onSelect={(slug) => navigate({ to: teamRoutes(slug).events })}
      onJoin={() => navigate({ to: '/onboarding/join' })}
      onCreate={() => navigate({ to: '/create-team' })}
    />
  )
}
