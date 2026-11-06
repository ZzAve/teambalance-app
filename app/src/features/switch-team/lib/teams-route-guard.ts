import type { AuthenticatedUser } from '@shared/api/auth'
import { LOGIN_PATH } from '@shared/api/auth-redirect'

/** The narrow session view the Teams route guard reads — or `null` when there is no session. */
type GuardUser = Pick<AuthenticatedUser, 'teams'> | null

/**
 * Where the Teams route (`/select-team`) sends the caller before rendering, or `null` to stay.
 *
 * Slice 2 relaxes this (ADR-0027 §4): an Active Team no longer bounces to `/` — the Teams view is now
 * the fuller entry point (switch · join · create) and must be reachable *with* a team set. Only two
 * redirects remain, both pre-existing:
 * - no session → LOGIN_PATH (`/login`, or `/demo` in the demo build)
 * - truly teamless (no memberships) → the unchanged `/onboarding`, the single core teamless view
 */
export function teamsRouteRedirect(user: GuardUser): typeof LOGIN_PATH | '/onboarding' | null {
  if (!user) return LOGIN_PATH
  if (user.teams.length === 0) return '/onboarding'
  return null
}
