import { useCurrentUser } from '@shared/api/auth'
import { useBunqConnection } from '@shared/api/bunq-connection'
import { useMoneyPool } from '@shared/api/money-pool'
import { TopUp } from '@features/top-up/ui/TopUp'
import { MoneyPoolView } from './MoneyPoolView'

export function MoneyPool() {
  const { data, isLoading, isError } = useMoneyPool()
  const user = useCurrentUser()
  const isAdmin = user?.role === 'ADMIN'
  // Only an admin of a not-connected team is pointed to the team settings, and only they may read the status.
  const { data: connection } = useBunqConnection(isAdmin && data?.state === 'NotConnected')

  return (
    <MoneyPoolView
      state={data?.state}
      isLoading={isLoading}
      isError={isError}
      isAdmin={isAdmin}
      balance={data?.balance}
      payments={data?.payments}
      beerPrice={data?.beerPrice}
      beerCount={data?.beerCount}
      canTopUp={data?.canTopUp}
      connectAvailable={connection?.connectAvailable}
      // The payment description carries the caller's id, so the server refuses top-ups under act-as.
      topUp={user?.actAs ? null : <TopUp />}
    />
  )
}
