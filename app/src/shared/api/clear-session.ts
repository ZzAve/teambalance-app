import { useUserStore } from '@shared/stores/user-store'
import { authMeQueryOptions } from './auth'
import { LOGIN_PATH } from './auth-redirect'
import { queryClient } from './query-client'

/**
 * Client-only session teardown (ADR-0027 §3): drop the user store, null the cached `/auth/me`, and
 * hard-redirect to `/login` — with **no** `api.Logout()` round-trip, so it still works when the
 * backend is the thing that is down.
 *
 * The in-shell logout calls `api.Logout()` first (a clean server-side teardown) and **then** this;
 * the out-of-shell escape hatch (later slice) calls this alone. Because it touches only the store,
 * the cache, and the location, it makes zero network calls — the unit test pins that.
 */
export function clearSession() {
  useUserStore.getState().setCurrentUser(null)
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
