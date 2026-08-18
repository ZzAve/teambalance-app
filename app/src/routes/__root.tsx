import { createRootRoute, redirect, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { Providers } from '@app/providers'
import { BottomNav } from '@shared/ui/BottomNav'
import { authMeQueryOptions } from '@shared/api/auth'
import { currentMemberQueryOptions } from '@shared/api/members'
import { queryClient } from '@shared/api/query-client'
import { directionFromIndices } from '@shared/lib/view-transition-direction'
import { useUserStore } from '@shared/stores/user-store'

// Only the sign-in routes (and the invite landing page, reachable before a joiner has any
// session) render without a confirmed session. Exact `/auth/` prefix — not startsWith('/auth') —
// so a future route like `/authored` can't slip past the guard. The invite exemption is equally
// precise: only `/invite/<single-token>` is public; sub-paths like `/invite/manage` are NOT exempt.
function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname.startsWith('/auth/') || /^\/invite\/[^/]+$/.test(pathname)
}

export const Route = createRootRoute({
  component: RootLayout,
  // A true gate: the session is probed before a protected route loads, so its component never
  // mounts (and never fetches protected data) unless the session is confirmed. An unauthenticated
  // 401 — or any /me error (fail closed) — redirects to login before render.
  beforeLoad: async ({ location }) => {
    if (isAuthRoute(location.pathname)) return
    let user = null
    try {
      user = await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      // Session could not be confirmed (network / 5xx) — fail closed.
    }
    if (!user) throw redirect({ to: '/login' })

    // Has-a-team gate: an authenticated but teamless user is a first-class state — route them to
    // /onboarding (the join-vs-create fork), and do it BEFORE the onboarding gate's tenant-scoped
    // /members/me probe (which would 403 NO_TEAM_MEMBERSHIP and bounce them to /login). /onboarding
    // and its /onboarding/join and /create-team branches are exempt so the fork can render (mirroring
    // how /get-started is exempt from the onboarding gate below). Teamlessness is read from the
    // explicit team field, not inferred from role == null (permission vs membership; see #26).
    if (
      location.pathname === '/onboarding' ||
      location.pathname === '/onboarding/' ||
      location.pathname === '/onboarding/join' ||
      location.pathname === '/onboarding/join/' ||
      location.pathname === '/create-team' ||
      location.pathname === '/create-team/'
    )
      return
    if (!user.team) throw redirect({ to: '/onboarding' })

    // Onboarding gate: a confirmed member who hasn't completed onboarding is routed to /get-started
    // before any app screen mounts. /get-started itself is exempt (below) so the flow can render; the
    // auth routes are already exempt (returned above). Read /members/me through the cache — race-
    // free, same pattern as the /members admin gate. Fail OPEN if the state can't be determined:
    // an onboarding-status blip shouldn't trap the user, and auth was already confirmed.
    if (location.pathname === '/get-started' || location.pathname === '/get-started/') return
    let member = null
    try {
      member = await queryClient.ensureQueryData(currentMemberQueryOptions)
    } catch {
      // Couldn't read onboarding state — don't trap the user.
    }
    if (member && !member.onboarded) throw redirect({ to: '/get-started' })
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
  const teamName = useUserStore((s) => s.teamName)

  return (
    <Providers>
      {/* min-h-dvh (not min-h-screen/100vh) so the layout measures the *visible* viewport on mobile —
          the dynamic unit accounts for browser chrome and pairs with viewport-fit=cover. */}
      <div className="min-h-dvh bg-background">
        {/* The tab bar (BottomNav) is now the single primary nav — the header carries only identity
            (wordmark + real team name, top-right), no nav links. Horizontal safe-area insets keep it
            clear of a landscape notch now that viewport-fit=cover lets content into the inset region.
            Its height is fixed to --header-height (global.css) rather than left to fall out of the
            padding: that same variable is what every sticky PageHeader offsets by, so the sub-header
            can no longer drift out of alignment when this header changes (F12, #159). */}
        <header
          className="sticky top-0 z-40 h-[var(--header-height)] border-b border-border/40 bg-card/88 backdrop-blur-lg"
          style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
        >
          <div className="flex h-full items-center justify-between px-5">
            <Link to="/" className="font-display text-xl font-bold text-blue">
              Team<span className="text-green">Balance</span>
            </Link>
            {teamName && (
              <div className="flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                {teamName}
              </div>
            )}
          </div>
        </header>
        {/* Bottom padding clears the fixed nav (~6rem) plus the home-indicator inset, so the last
            row of content is never hidden behind the bar on notched devices. */}
        <main className="mx-auto max-w-2xl px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      {/* App-wide toast primitive. richColors gives the error toast a semantic red; the default
          light theme matches the app surface (no dark-mode toggle is wired yet). */}
      <Toaster position="top-center" richColors />
    </Providers>
  )
}
