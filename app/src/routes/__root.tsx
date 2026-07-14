import { createRootRoute, redirect, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Providers } from '@app/providers'
import { BottomNav } from '@shared/ui/BottomNav'
import { authMeQueryOptions, useLogout } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { useUserStore } from '@shared/stores/user-store'

// Only the sign-in routes render without a confirmed session. Exact `/auth/` prefix — not
// startsWith('/auth') — so a future route like `/authored` can't slip past the guard.
function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname.startsWith('/auth/')
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
            <LogoutButton />
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
