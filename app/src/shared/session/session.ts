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
    activeTeam: user?.activeTeam ?? null,
    role: user?.role ?? null,
    isAdmin: user?.role === 'ADMIN',
    isActingAs: !!user?.actAs,
  }
}

/**
 * Everything cached belongs to the tenant the caller just left (tenant-scoped queries are keyed
 * without the Team in them), so the whole cache is reset and `/auth/me` is read again for the new
 * Active Team. resetQueries, not clear(): the same components stay mounted across a switch, and
 * clear() empties the cache without telling their observers to refetch. Null when `/auth/me` could
 * not be read.
 */
export async function afterTenantChange(): Promise<AuthenticatedUser | null> {
  await queryClient.resetQueries()
  return queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
}

/**
 * The authorized switch of the Active Team (ADR-0023 §2) followed by the tenant change. Null when the
 * team could not be activated (unknown slug, or not the caller's); otherwise the user as `/auth/me`
 * now reports them, itself null when that read failed.
 */
export async function enterTeam(slug: string): Promise<{ user: AuthenticatedUser | null } | null> {
  const activated = await activateTeam(slug).catch(() => null)
  if (!activated) return null
  return { user: await afterTenantChange() }
}

/**
 * Client-only session teardown (ADR-0027 §3): null the cached `/auth/me`, and
 * hard-redirect to `/login` — with **no** `api.Logout()` round-trip, so it still works when the
 * backend is the thing that is down.
 *
 * The in-shell logout calls `api.Logout()` first (a clean server-side teardown) and **then** this;
 * the out-of-shell escape hatch calls this alone. Because it touches only the cache and the
 * location, it makes zero network calls — the unit test pins that.
 */
export function endSession() {
  queryClient.setQueryData(authMeQueryOptions.queryKey, null)
  // A hard nav, not a router push: it fully resets in-memory state and works from the out-of-shell
  // states that render without the router's shell.
  window.location.assign(LOGIN_PATH)
}

/**
 * Whether an out-of-shell escape hatch should offer "Log out" (ADR-0027 §3). Logout is a property of
 * *having a session*, so the hatch shows whenever a session exists — or *might* (the `/auth/me` probe
 * hasn't resolved) — and hides only once the cache has positively resolved to "no user". Fail-open:
 * an indeterminate session (`undefined`, never fetched) still shows the hatch.
 */
export function hasClearableSession(): boolean {
  return queryClient.getQueryData(authMeQueryOptions.queryKey) !== null
}
