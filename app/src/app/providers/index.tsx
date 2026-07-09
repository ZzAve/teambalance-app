import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserHydrator />
      {children}
    </QueryClientProvider>
  )
}
