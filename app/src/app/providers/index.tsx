import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { queryClient } from '@shared/api/query-client'
import { useAuthMe } from '@shared/api/auth'
import { useUserStore } from '@shared/stores/user-store'

// Keeps the user store in sync with the session — the single source of identity. Route protection
// itself lives in the root route's beforeLoad guard (see routes/__root.tsx), which gates rendering
// before a protected route ever mounts.
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
