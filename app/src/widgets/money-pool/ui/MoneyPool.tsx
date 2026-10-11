import { useCurrentUser } from '@shared/api/auth'
import { useMoneyPool } from '@shared/api/money-pool'
import { TopUp } from '@features/top-up/ui/TopUp'
import { MoneyPoolView } from './MoneyPoolView'

export function MoneyPool() {
  const { data, isLoading, isError } = useMoneyPool()
  const isAdmin = useCurrentUser()?.role === 'ADMIN'

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
      topUp={<TopUp />}
    />
  )
}
