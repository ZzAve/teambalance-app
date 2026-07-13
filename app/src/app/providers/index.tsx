import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import { useAuthMe } from '@shared/api/auth'
import { useUserStore } from '@shared/stores/user-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

// Keeps the user store in sync with the session — the single source of identity.
function UserHydrator() {
  const { data } = useAuthMe()
  const setCurrentUser = useUserStore((s) => s.setCurrentUser)

  useEffect(() => {
    if (data !== undefined) setCurrentUser(data)
  }, [data, setCurrentUser])

  return null
}

// Sends unauthenticated visitors to the login screen. useAuthMe returns null on a 401 session probe;
// the login and magic-link routes are exempt so the sign-in flow itself isn't bounced.
function AuthGuard() {
  const { data, isLoading, isError } = useAuthMe()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (isLoading || isError) return
    const onAuthRoute = pathname === '/login' || pathname.startsWith('/auth')
    if (data === null && !onAuthRoute) {
      navigate({ to: '/login', replace: true })
    }
  }, [data, isLoading, isError, pathname, navigate])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserHydrator />
      <AuthGuard />
      {children}
    </QueryClientProvider>
  )
}
