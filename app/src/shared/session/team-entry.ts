import type { AuthenticatedUser } from '@shared/api/auth'
import { teamRoutes } from '@shared/lib/team-routes'

type TeamEntryDecision = 'login' | 'activate' | 'check-onboarding' | 'get-started' | 'ok'

/**
 * What entering `/t/:slug/…` requires, given what is known so far. `member` is undefined until the
 * current Member has been read, and null when that read failed (entry then fails open: a status
 * blip must not trap a confirmed caller). 'check-onboarding' means "read the member, then ask again".
 */
export function decideTeamEntry(
  user: AuthenticatedUser | null,
  slug: string,
  pathname: string,
  member?: { onboarded: boolean } | null,
): TeamEntryDecision {
  if (!user) return 'login'
  if (user.activeTeam?.slug !== slug) return 'activate'
  // A Platform Admin acting-as is not a member (ADR-0024 §3): /members/me 404s for them and
  // onboarding is meaningless to them.
  if (user.actAs) return 'ok'
  if (pathname.replace(/\/$/, '') === teamRoutes(slug).getStarted) return 'ok'
  if (member === undefined) return 'check-onboarding'
  return member && !member.onboarded ? 'get-started' : 'ok'
}

/**
 * Where a caller who belongs to no Team goes (ADR-0024): the console for a Platform Admin, onboarding
 * for a player. Null when they have teams, or are inside one by act-as.
 */
export function teamlessDestination(user: AuthenticatedUser): '/admin/teams' | '/onboarding' | null {
  if (user.teams.length > 0 || user.actAs) return null
  return user.isPlatformAdmin ? '/admin/teams' : '/onboarding'
}

/** Where `/` sends a signed-in caller. */
export function decideLanding(user: AuthenticatedUser): string {
  const teamless = teamlessDestination(user)
  if (teamless) return teamless
  if (!user.activeTeam) return '/select-team'
  return teamRoutes(user.activeTeam.slug).events
}
