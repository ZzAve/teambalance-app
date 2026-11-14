import { useMutation } from '@tanstack/react-query'
import { apiErrorOf } from './api-error'
import { api } from './wirespec-client'

/** The guests a visitor can play on the demo build (ADR-0043). */
export type DemoPersona = 'MEMBER' | 'ADMIN'

/** Starts a normal session for a demo persona. The caller then reads /api/auth/me like after any sign-in. */
export function useCreateDemoSession() {
  return useMutation({
    mutationFn: async (persona: DemoPersona) => {
      const res = await api.createDemoSession({ body: { persona } })
      if (res.status !== 204) throw apiErrorOf(res, `Demo session failed with status ${res.status}`)
    },
  })
}
