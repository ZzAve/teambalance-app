import { useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract types so the app has a single source of truth.
export type { MoneyPool } from './generated/model/MoneyPool'
export type { MoneyPoolState } from './generated/model/MoneyPoolState'
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
