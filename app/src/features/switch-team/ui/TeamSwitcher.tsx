import { useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'
import { TeamSwitcherView } from './TeamSwitcherView'

/**
 * Thin wiring for [TeamSwitcherView]. Switching is an ordinary navigation to `/t/:slug` rather than a
 * call to the switch endpoint, so a tap and a shared link go through one door (ADR-0023 §2).
 */
export function TeamSwitcher() {
  const navigate = useNavigate()
  const { data: user } = useAuthMe()

  return (
    <TeamSwitcherView
      teams={user?.teams ?? []}
      activeTeam={user?.activeTeam ?? null}
      onSelect={(slug) => navigate({ to: teamRoutes(slug).events })}
    />
  )
}
