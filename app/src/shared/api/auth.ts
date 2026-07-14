import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { AuthenticatedUser } from './generated/model/AuthenticatedUser'

export function useRequestMagicLink() {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.RequestMagicLink({ body: { email } })
    },
  })
}

export function useVerifyMagicLink() {
  return useMutation({
    mutationFn: async (token: string) => {
      const res = await api.VerifyMagicLink({ body: { token } })
      if (res.status === 401) throw new Error('Invalid or expired link')
      return res.body
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.Logout()
    },
  })
}

// Shared so the root route's beforeLoad guard can prime this exact query (ensureQueryData) and
// useAuthMe reads it back from cache — no duplicate fetch, no drifting query key. A 401 probe
// resolves to null (unauthenticated); a non-401 error rejects and is treated as unconfirmed.
export const authMeQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: async () => {
    const res = await api.GetAuthMe()
    if (res.status === 401) return null
    return res.body
  },
})

export function useAuthMe() {
  return useQuery(authMeQueryOptions)
}
