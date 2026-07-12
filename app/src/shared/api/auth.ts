import { useMutation, useQuery } from '@tanstack/react-query'
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

export function useAuthMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.GetAuthMe()
      if (res.status === 401) return null
      return res.body
    },
  })
}
