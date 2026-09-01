import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { AuthenticatedUser } from './generated/model/AuthenticatedUser'

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
// resolves to null (unauthenticated); anything else that isn't a usable user rejects and is treated
// as unconfirmed (retried, then the router's error fallback).
export const authMeQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: async () => {
    const res = await api.GetAuthMe()
    if (res.status === 401) return null
    // A 200 must carry the user. A cold or misbehaving backend can answer with an empty (0-byte) or
    // partial body — the wirespec client has no "a 200 has a body" contract, so it surfaces that as
    // `undefined`. That is NOT a signed-out session: reading it as such would bounce a valid user to
    // /login, and letting a bare `undefined` through would only reject later inside react-query
    // ("Query data cannot be undefined"). Reject it explicitly as an unconfirmed session instead, so
    // the guard's fail-closed path routes it to the retry/error fallback exactly like a 5xx.
    const user = res.body as AuthenticatedUser | undefined
    if (!user || typeof user !== 'object' || !Array.isArray(user.teams)) {
      throw new Error(`Unconfirmed session: /me returned status ${res.status} without a usable body`)
    }
    return user
  },
})

export function useAuthMe() {
  return useQuery(authMeQueryOptions)
}
