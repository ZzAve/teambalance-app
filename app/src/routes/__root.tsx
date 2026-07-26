import { createRootRoute, redirect, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Providers } from '@app/providers'
import { BottomNav } from '@shared/ui/BottomNav'
import { authMeQueryOptions, useLogout } from '@shared/api/auth'
import { currentMemberQueryOptions } from '@shared/api/members'
import { queryClient } from '@shared/api/query-client'
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

    // Onboarding gate: a confirmed member who hasn't completed onboarding is routed to /welcome
    // before any app screen mounts. /welcome itself is exempt (below) so the flow can render; the
    // auth routes are already exempt (returned above). Read /members/me through the cache — race-
    // free, same pattern as the /members admin gate. Fail OPEN if the state can't be determined:
    // an onboarding-status blip shouldn't trap the user, and auth was already confirmed.
    if (location.pathname === '/welcome' || location.pathname === '/welcome/') return
    let member = null
    try {
      member = await queryClient.ensureQueryData(currentMemberQueryOptions)
    } catch {
      // Couldn't read onboarding state — don't trap the user.
    }
    if (member && !member.onboarded) throw redirect({ to: '/welcome' })
  },
})

function useViewTransitions() {
  const location = useRouterState({ select: (s) => s.location })
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    const prevPath = prevPathRef.current
    const nextPath = location.pathname

    // Heuristic: going to a deeper path = forward (slide right in), going shallower = back (slide left in)
    const isBack = prevPath.length > nextPath.length || nextPath === '/'

    if (isBack) {
      document.documentElement.classList.add('vt-slide-back')
    } else {
      document.documentElement.classList.remove('vt-slide-back')
    }

    prevPathRef.current = nextPath
  }, [location.pathname])
}

function LogoutButton() {
  const userId = useUserStore((s) => s.userId)
  const setCurrentUser = useUserStore((s) => s.setCurrentUser)
  const logout = useLogout()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  if (!userId) return null

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setCurrentUser(null)
        queryClient.setQueryData(['auth', 'me'], null)
        navigate({ to: '/login' })
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      Log out
    </button>
  )
}

function RootLayout() {
  useViewTransitions()
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border/40 bg-card/88 backdrop-blur-lg">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-xl font-bold text-blue">
                Team<span className="text-green">Balance</span>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                Heren 3
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/members"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  activeProps={{ className: 'text-foreground' }}
                >
                  Members
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/team/settings"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  activeProps={{ className: 'text-foreground' }}
                >
                  Settings
                </Link>
              )}
              <Link
                to="/profile"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                Profile
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </Providers>
  )
}
