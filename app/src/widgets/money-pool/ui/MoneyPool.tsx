import { useCurrentUser } from '@shared/api/auth'
import { useBunqConnection } from '@shared/api/bunq-connection'
import { useMembers } from '@shared/api/members'
import { useSeason } from '@shared/api/season'
import { useMoneyPool } from '@shared/api/money-pool'
import { ClaimPayment } from '@features/claim-payment/ui/ClaimPayment'
import { claimVariant } from '@features/claim-payment/lib/claim-variant'
import { ReceiptButton } from '@features/attach-receipt/ui/ReceiptButton'
import { TopUp } from '@features/top-up/ui/TopUp'
import { formatEuro } from '../lib/format'
import { paymentsFollowSeason } from '../lib/season-period'
import { MoneyPoolView } from './MoneyPoolView'

export function MoneyPool() {
  const { data, isLoading, isError } = useMoneyPool()
  const { data: season } = useSeason()
  const { data: members } = useMembers()
  const user = useCurrentUser()
  const isAdmin = user?.role === 'ADMIN'
  // Only an admin of a not-connected or rejected team is pointed to the team settings, and only they may read the status.
  const { data: connection } = useBunqConnection(isAdmin && (data?.state === 'NotConnected' || data?.state === 'Rejected'))

  // The 'sv-SE' locale formats a local date as YYYY-MM-DD, the ISO form the season start uses.
  const today = new Date().toLocaleDateString('sv-SE')

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
      seasonSet={season && paymentsFollowSeason(season.start, today)}
      today={today}
      members={members}
      // Under act-as the viewer is a Platform Admin, not a member of the team: no row is theirs.
      youId={user?.actAs ? undefined : user?.id}
      canTopUp={data?.canTopUp}
      connectAvailable={connection?.connectAvailable}
      accountPending={connection?.connected === true && !connection.accountPicked}
      // The payment description carries the caller's id, so the server refuses top-ups under act-as.
      topUp={user?.actAs ? null : <TopUp />}
      receipt={(expense) => (
        <ReceiptButton
          paymentId={expense.id}
          // The server writes no receipt as null, which the generated type calls undefined.
          receiptVersion={expense.receiptVersion ?? undefined}
          name={expense.name}
          amount={formatEuro(expense.amount)}
        />
      )}
      claim={(payment) => {
        const variant = claimVariant(user, payment)
        return variant && <ClaimPayment payment={payment} variant={variant} amount={formatEuro(payment.amount)} />
      }}
    />
  )
}
