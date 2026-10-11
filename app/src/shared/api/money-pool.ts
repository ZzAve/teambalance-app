import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authMeQueryOptions } from './auth'
import type { MoneyPoolSettings } from './generated/model/MoneyPoolSettings'
import { api } from './wirespec-client'

// Re-export the generated contract types so the app has a single source of truth.
export type { MoneyPool } from './generated/model/MoneyPool'
export type { MoneyPoolState } from './generated/model/MoneyPoolState'
export type { MoneyPoolSettings } from './generated/model/MoneyPoolSettings'
export type { Payment } from './generated/model/Payment'

// The current team's money pool. Readable by any member; `state` says whether the pool is switched
// off, not connected, unreachable, or connected (then balance and payments are set).
export function useMoneyPool() {
  return useQuery({
    queryKey: ['money-pool'],
    queryFn: async () => {
      const res = await api.GetMoneyPool()
      return res.body
    },
  })
}

// The team's money pool settings. Admin-only (403 otherwise). Keyed under ['money-pool'] so saving
// them refreshes the pool itself too.
export function useMoneyPoolSettings() {
  return useQuery({
    queryKey: ['money-pool', 'settings'],
    queryFn: async () => {
      const res = await api.GetMoneyPoolSettings()
      if (res.status === 403) throw new Error('You are not allowed to see the money pool settings.')
      return res.body
    },
  })
}

// A save replaces every setting. The switch also lives on /me (it drives the nav and the Money
// route), so that is refreshed along with the pool.
export function useSetMoneyPoolSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (settings: MoneyPoolSettings) => {
      const res = await api.PutMoneyPoolSettings({ body: settings })
      if (res.status === 403) throw new Error('You are not allowed to change the money pool settings.')
      return res.body
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['money-pool'] }),
        queryClient.invalidateQueries({ queryKey: authMeQueryOptions.queryKey }),
      ]),
  })
}
