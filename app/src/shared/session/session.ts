import { authMeQueryOptions, useAuthMe, type AuthenticatedUser } from '@shared/api/auth'
import { LOGIN_PATH } from '@shared/api/auth-redirect'
import { queryClient } from '@shared/api/query-client'
import { activateTeam } from '@shared/api/teams'

/** The signed-in caller and what follows from it, read from the cached `/auth/me`. */
export function useSession() {
  const { data } = useAuthMe()
  const user = data ?? null
  return {
    user,
    isAdmin: user?.role === 'ADMIN',
    isActingAs: !!user?.actAs,
  }
}

/**
 * Resets the whole cache (tenant-scoped queries are keyed without the Team) and reads `/auth/me`
 * again. resetQueries, not clear(): the same components stay mounted across a switch, and clear()
 * does not tell their observers to refetch. Null when `/auth/me` could not be read.
 */
export async function afterTenantChange(): Promise<AuthenticatedUser | null> {
  await queryClient.resetQueries()
  return queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
}

/**
 * The authorized switch of the Active Team (ADR-0023 §2) followed by the tenant change. Null when the
 * team could not be activated; otherwise the user as `/auth/me` now reports them, itself null when
 * that read failed.
 */
export async function enterTeam(slug: string): Promise<{ user: AuthenticatedUser | null } | null> {
  const activated = await activateTeam(slug).catch(() => null)
  if (!activated) return null
  return { user: await afterTenantChange() }
}

/**
 * Client-only session teardown (ADR-0027 §3): nulls the cached `/auth/me` and hard-redirects to
 * `/login` without calling the API, so it works when the backend is down.
 */
export function endSession() {
  queryClient.setQueryData(authMeQueryOptions.queryKey, null)
  // A hard nav, not a router push: it also works from out-of-shell states that render without the router.
  window.location.assign(LOGIN_PATH)
}

/**
 * Whether an out-of-shell escape hatch should offer "Log out" (ADR-0027 §3): true unless the cache
 * has resolved to "no user". An indeterminate session (never fetched) still shows it.
 */
export function hasClearableSession(): boolean {
  return queryClient.getQueryData(authMeQueryOptions.queryKey) !== null
}
