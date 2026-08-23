import { createRootRoute, redirect, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { Providers } from '@app/providers'
import { BottomNav } from '@shared/ui/BottomNav'
import { authMeQueryOptions } from '@shared/api/auth'
import { TeamSwitcher } from '@features/switch-team/ui/TeamSwitcher'
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

// The screens an authenticated caller can reach without being in a Team: the join-vs-create fork,
// its two branches, and the picker a Member of several Teams lands on when none is active.
function isTeamlessRoute(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '')
  return (
    path === '/onboarding' ||
    path === '/onboarding/join' ||
    path === '/create-team' ||
    path === '/select-team' ||
    path === '/admin/creation-codes'
  )
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

    // Has-ANY-team gate (ADR-0023 §4, amending ADR-0019 §6). The question this gate asks changed
    // with #143: it is no longer "do you have a team" but "do you have *any* Team" — and *which* one
    // is active is a separate question, answered per-route by /t/$slug and never inferred from the
    // list's order. A teamless caller is a first-class state, routed to the join-vs-create fork
    // before any tenant-scoped probe (which would 403 NO_TEAM_MEMBERSHIP and bounce them to /login).
    // Teamlessness is read from the explicit teams list, not inferred from role == null (permission
    // vs membership; see #26).
    //
    // The onboarding gate that used to live here moved to /t/$slug: onboarding is per-Team, so it
    // can only be asked once the Active Team is settled.
    if (isTeamlessRoute(location.pathname)) return
    if (user.teams.length === 0) throw redirect({ to: '/onboarding' })
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
            {/* The switcher is permanent UI and always names the current Team (ADR-0023 §3). That
                visibility is what makes one-kind-of-switch tolerable: opening a teammate's link
                re-homes your default, and the only thing that makes it correctable is being able to
                see, at a glance, which Team you are in. */}
            <TeamSwitcher />
          </div>
        </header>
        {/* Bottom padding clears the fixed nav (~6rem) plus the home-indicator inset, so the last
            row of content is never hidden behind the bar on notched devices. */}
        <main className="mx-auto max-w-2xl px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      {/* App-wide toast primitive. richColors gives the error toast a semantic red; `theme` is the
          resolved theme rather than sonner's own "system" so it follows the in-app preference —
          a user on Light with a dark OS must not get dark toasts. */}
      <Toaster position="top-center" richColors theme={theme} />
    </Providers>
  )
}
