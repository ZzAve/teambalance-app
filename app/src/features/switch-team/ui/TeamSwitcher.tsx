import { useNavigate } from '@tanstack/react-router'
import { useAuthMe } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'
import { TeamSwitcherView } from './TeamSwitcherView'

/**
 * Thin wiring for [TeamSwitcherView]: the caller's Teams from `/auth/me`, and a switch performed as
 * an ordinary navigation to `/t/:slug`.
 *
 * Navigating rather than calling the switch endpoint here is deliberate — `/t/$slug`'s gate already
 * performs the authorized switch for a shared link, and routing the switcher through the same door
 * keeps one code path for both (ADR-0021 §2). A switcher that called activate itself would be the
 * second tenant-resolution path the ADR exists to prevent.
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
