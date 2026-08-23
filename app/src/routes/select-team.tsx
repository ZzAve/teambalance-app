import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'
import { queryClient } from '@shared/api/query-client'
import { authMeQueryOptions } from '@shared/api/auth'
import { SelectTeamView } from '@features/switch-team/ui/SelectTeamView'

/**
 * "Which Team?" — where a Member of several Teams lands when none is remembered, because tenant
 * resolution refuses to guess (ADR-0023 §1). Picking one is an ordinary navigation to `/t/:slug`,
 * whose gate performs the switch.
 */
export const Route = createFileRoute('/select-team')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    if (user.teams.length === 0) throw redirect({ to: '/onboarding' })
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
