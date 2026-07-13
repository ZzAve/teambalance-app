import { createRootRoute, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Providers } from '@app/providers'
import { BottomNav } from '@shared/ui/BottomNav'
import { useLogout } from '@shared/api/auth'
import { useUserStore } from '@shared/stores/user-store'

export const Route = createRootRoute({
  component: RootLayout,
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
