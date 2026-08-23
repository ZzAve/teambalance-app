import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'
import { queryClient } from '@shared/api/query-client'
import { authMeQueryOptions } from '@shared/api/auth'
import { SelectTeamView } from '@features/switch-team/ui/SelectTeamView'

/**
 * "Which Team?" — the screen that exists because tenant resolution refuses to guess.
 *
 * A Member of several Teams with none remembered lands here rather than in an arbitrary one
 * (ADR-0023 §1/§3). Reaching it is a real state, not an error: it happens on a first sign-in after
 * joining a second Team, and after the remembered Team's membership ends.
 *
 * Picking a Team is an ordinary navigation to `/t/:slug` — that route's gate performs the authorized
 * switch, so this screen holds no switching logic of its own.
 */
export const Route = createFileRoute('/select-team')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    if (user.teams.length === 0) throw redirect({ to: '/onboarding' })
    // A caller who already has an Active Team has nothing to choose — `/` sends them into it.
    if (user.activeTeam) throw redirect({ to: '/' })
  },
  component: SelectTeamPage,
})

function SelectTeamPage() {
  const navigate = useNavigate()
  const { data: user } = useAuthMe()

  return (
    <SelectTeamView
      teams={user?.teams ?? []}
      onSelect={(slug) => navigate({ to: teamRoutes(slug).events })}
    />
  )
}
