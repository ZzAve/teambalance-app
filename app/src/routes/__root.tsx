import { createRootRoute, redirect, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { Providers } from '@app/providers'
import { SwUpdateManager } from '@app/pwa/sw-update'
import { AppShellFrame } from '@shared/ui/AppShellFrame'
import { BottomNav } from '@shared/ui/BottomNav'
import { authMeQueryOptions } from '@shared/api/auth'
import { TeamSwitcher } from '@features/switch-team/ui/TeamSwitcher'
import { ActAsBanner } from '@features/act-as/ui/ActAsBanner'
import { queryClient } from '@shared/api/query-client'
import { directionFromIndices } from '@shared/lib/view-transition-direction'
import { useThemeSync } from '@shared/theme/theme-store'

// Only the sign-in routes (and the invite landing page, reachable before a joiner has any
// session) render without a confirmed session. Exact `/auth/` prefix — not startsWith('/auth') —
// so a future route like `/authored` can't slip past the guard. The invite exemption is equally
// precise: only `/invite/<single-token>` is public; sub-paths like `/invite/manage` are NOT exempt.
function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname.startsWith('/auth/') || /^\/invite\/[^/]+$/.test(pathname)
}

// The screens an authenticated caller can reach without being in a Team.
function isTeamlessRoute(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '')
  return (
    path === '/onboarding' ||
    path === '/onboarding/join' ||
    path === '/create-team' ||
    path === '/select-team' ||
    path === '/admin/creation-codes' ||
    path === '/admin/teams' ||
    // The team-independent Account tab (ADR-0027 §1): a teamless caller reaches it instead of being
    // parked on /onboarding, so Log out is reachable with no team.
    path === '/account'
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  // A true gate: the session is probed before a protected route loads, so its component never
  // mounts (and never fetches protected data) unless the session is confirmed. An unauthenticated
  // 401 redirects to login before render; a backend error surfaces the router's error fallback
  // (see below) — either way the protected route is never rendered.
  beforeLoad: async ({ location }) => {
    if (isAuthRoute(location.pathname)) return
    // A genuine 401 resolves to null → /login. A backend error (network / 5xx while the
    // scale-to-zero container is still waking) REJECTS: let it propagate to the router's
    // themed error fallback (Retry reloads, by which point the backend is warm) instead of
    // failing closed to /login. Failing closed here both logged out a still-valid session
    // and — because the errored /me query stayed in cache while RootLayout mounted — crashed
    // the render into a blank frame.
    const user = await queryClient.ensureQueryData(authMeQueryOptions)
    if (!user) throw redirect({ to: '/login' })

    // Has-ANY-team gate (ADR-0023 §4). Which Team is active is a separate question, answered by
    // /t/$slug. Teamlessness is read from the explicit list, never inferred from role == null
    // (permission vs membership; see #26), and is checked before any tenant-scoped probe, which
    // would 403 NO_TEAM_MEMBERSHIP and bounce a teamless caller to /login.
    if (isTeamlessRoute(location.pathname)) return
    if (user.teams.length > 0) return
    // Teamless, but three different situations (ADR-0024). A Platform Admin inside a Team is scoped
    // to it without being a Member, so team-scoped routes are legitimately theirs; one who is inside
    // no Team — never entered, or the 60-minute box ran out — belongs on the console, not in
    // onboarding, which exists to get a *player* into a team they would then be a Member of.
    if (user.actAs) return
    throw redirect({ to: user.isPlatformAdmin ? '/admin/teams' : '/onboarding' })
  },
})

// Slide direction comes from the router's history index, not the path (F8, #159): only a
// *decreasing* index is a real pop. The href is a dependency too, so a navigation that keeps the
// index (a replace) still re-evaluates instead of inheriting the previous move's direction. The
// decision itself is a pure, unit-tested helper; the hook only owns the class toggle.
function useViewTransitions() {
  const href = useRouterState({ select: (s) => s.location.href })
  const historyIndex = useRouterState({ select: (s) => s.location.state.__TSR_index })
  // Starts empty on purpose: the first render (cold load or hard refresh, which keeps whatever
  // index the entry already had) has nothing to compare against, so it slides forward.
  const prevIndexRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const direction = directionFromIndices(prevIndexRef.current, historyIndex)
    document.documentElement.classList.toggle('vt-slide-back', direction === 'back')
    prevIndexRef.current = historyIndex
  }, [href, historyIndex])
}

function RootLayout() {
  useViewTransitions()
  // Single owner of the theme's DOM effects (F11, #159): keeps the `.dark` class and the
  // theme-color meta in step with the resolved theme, and re-resolves when the OS scheme flips
  // while the preference is `system`. index.html applies the first frame; this owns every frame
  // after it. The returned value is the resolved theme, which sonner needs as a prop.
  const theme = useThemeSync()

  return (
    <Providers>
      {/* The frame itself (header, main column, tab bar) is a shared component so the Storybook
          app-shell decorator renders page composites in the identical chrome (ADR-0031 §3). */}
      <AppShellFrame teamSwitcher={<TeamSwitcher />} banner={<ActAsBanner />} nav={<BottomNav />}>
        <Outlet />
      </AppShellFrame>
      {/* App-wide toast primitive. richColors gives the error toast a semantic red; `theme` is the
          resolved theme rather than sonner's own "system" so it follows the in-app preference —
          a user on Light with a dark OS must not get dark toasts. */}
      <Toaster position="top-center" richColors theme={theme} />
      {/* Service-worker update lifecycle (caching plan Phase 3): auto-applies a new version by
          default and only shows a reload prompt when a deploy lands mid-session with unsaved work. */}
      <SwUpdateManager />
    </Providers>
  )
}
