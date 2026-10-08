import type { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Decorator } from '@storybook/react-vite'
import { authMeQueryOptions, type AuthenticatedUser } from '@shared/api/auth'

/** The signed-in user a story starts from; `undefined` for a teamless user. */
export function authenticatedUser(activeTeam: AuthenticatedUser['activeTeam']): AuthenticatedUser {
  return {
    id: 'user-1',
    email: 'jan@example.com',
    displayName: 'Jan',
    role: activeTeam ? 'USER' : undefined,
    teams: activeTeam ? [activeTeam] : [],
    activeTeam,
    isPlatformAdmin: false,
    actAs: undefined,
    personalPhotoVersion: undefined,
  }
}

/**
 * Provides a query client whose `/me` session is already answered, so a component reading
 * `useAuthMe` renders its settled state without a network call (stories hold the no-MSW line).
 */
export function AuthMeProvider({ user, children }: { user: AuthenticatedUser | null; children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } })
    client.setQueryData(authMeQueryOptions.queryKey, user)
    return client
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

/**
 * Storybook decorator that primes the `/me` session from `parameters.authMe`: an AuthenticatedUser,
 * or null for signed-out. Use it for components that read the Active Team (BottomNav on `/account`).
 */
export const withAuthMe: Decorator = (Story, context) => (
  <AuthMeProvider user={context.parameters?.authMe ?? null}>
    <Story />
  </AuthMeProvider>
)
