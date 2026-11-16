import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { i18n } from '@shared/i18n/i18n'
import type { Member } from '@shared/api/members'
import type { MoneyPoolState, Payment } from '@shared/api/money-pool'
import { ConnectedMoneyPool } from './ConnectedMoneyPool'
import { MemberExpenses } from './MemberExpenses'
import { MoneyPoolNotice } from './MoneyPoolNotice'
import { NotConnectedMoneyPool } from './NotConnectedMoneyPool'

interface MoneyPoolViewProps {
  /** Undefined until the first response arrives. */
  state: MoneyPoolState | undefined
  isLoading: boolean
  isError: boolean
  isAdmin: boolean
  /** Euro cents; set when `state` is Connected. */
  balance: number | undefined
  payments: Payment[] | undefined
  /** Euro cents; with `beerCount`, set when `state` is Connected and the team configured a price. */
  beerPrice?: number
  beerCount?: number
  /** The pool is on and a bunq.me link is set, in any state: members can pay without a Bunq Connection. */
  canTopUp?: boolean
  /** The top-up button, supplied by the MoneyPool container so this View stays prop-only. */
  topUp?: ReactNode
  /** The button that records an out-of-pocket expense, supplied by the container for the same reason. Shown in every state but Off: it needs no Bunq. */
  recordExpense?: ReactNode
  /** The control that changes or deletes an out-of-pocket expense, supplied by the container for the same reason. */
  editExpense?: (expense: Payment) => ReactNode
  /** The receipt control on each expense, supplied by the container for the same reason. */
  receipt?: (expense: Payment) => ReactNode
  /** The claim control on an incoming payment, supplied by the container for the same reason. */
  claim?: (payment: Payment) => ReactNode
  /** Connecting Bunq is available here: an admin of a not-connected or rejected team is pointed to the team settings. */
  connectAvailable?: boolean
  /** Bunq is connected but no account is picked: an admin is pointed to the team settings to pick one. */
  accountPending?: boolean
  /** The payments run from the season start (true) or the last 90 days (false); undefined until the season is known. */
  seasonSet?: boolean
  /** ISO calendar date of today. */
  today: string
  /** The team roster, supplied by the container, to name the Toppers. */
  members: Member[] | undefined
  /** The viewer's member id, for the "You" mark in the Toppers; absent under act-as. */
  youId?: string
}

function LoadError() {
  const { t } = useTranslation()
  return (
    <p role="alert" className="rounded-lg bg-card p-4 text-small text-red-ink">
      {t('money.loadFailed')}
    </p>
  )
}

/**
 * The money pool for the current team, one picture per state (ADR-0042). Prop-only (ADR-0017): the
 * loading and error shells render from props so they can be shown without a network.
 */
export function MoneyPoolView({
  state,
  isLoading,
  isError,
  isAdmin,
  balance,
  payments,
  beerPrice,
  beerCount,
  canTopUp,
  topUp,
  recordExpense,
  editExpense,
  receipt,
  claim,
  connectAvailable,
  accountPending,
  seasonSet,
  today,
  members,
  youId,
}: MoneyPoolViewProps) {
  const { t } = useTranslation()
  if (isLoading) return <p role="status" className="text-small text-muted-foreground">{t('account.loading')}</p>
  if (isError || state === undefined) return <LoadError />
  if (state === 'Off') {
    // The route redirects an Off team away, but a stale session can still land here.
    return <MoneyPoolNotice title={t('money.off')} />
  }

  const linkHint = isAdmin && state === 'Connected' && <p className="text-small text-muted-foreground">{t('money.linkHint')}</p>
  const topUpEntry = canTopUp ? topUp : linkHint

  if (state === 'Connected') {
    return balance === undefined ? <LoadError /> : (
        <ConnectedMoneyPool
          balance={balance}
          payments={payments ?? []}
          beerPrice={beerPrice}
          beerCount={beerCount}
          topUp={topUpEntry}
          recordExpense={recordExpense}
          editExpense={editExpense}
          receipt={receipt}
          claim={claim}
          seasonSet={seasonSet}
          today={today}
          members={members}
          youId={youId}
        />
      )
  }

  // Without a working Bunq connection the pool lists the out-of-pocket expenses alone (ADR-0048).
  const expenses = payments ?? []
  return (
    <div className="flex flex-col gap-6">
      {state === 'NotConnected' ? (
        <NotConnectedMoneyPool isAdmin={isAdmin} connectAvailable={connectAvailable} accountPending={accountPending} compact={expenses.length > 0} />
      ) : (
        <MoneyPoolNotice
          title={t('money.unavailable')}
          body={state === 'Rejected' ? rejectedBody(isAdmin, connectAvailable) : t('money.unreachable')}
        />
      )}
      {(topUpEntry || recordExpense) && (
        <div className="flex flex-col gap-3">
          {topUpEntry}
          {recordExpense}
          {recordExpense && expenses.length === 0 && <p className="text-center text-small text-muted-foreground">{t('money.noExpenses')}</p>}
        </div>
      )}
      {expenses.length > 0 && (
        <MemberExpenses
          payments={expenses}
          bankPaymentsMissing={state !== 'NotConnected'}
          editExpense={editExpense}
          receipt={receipt}
          seasonSet={seasonSet}
          today={today}
          members={members}
          youId={youId}
        />
      )}
    </div>
  )
}

function rejectedBody(isAdmin: boolean, connectAvailable?: boolean) {
  if (!isAdmin) return i18n.t('money.rejected.member')
  return connectAvailable === false ? i18n.t('money.rejected.reconnect') : i18n.t('money.rejected.reconnectInSettings')
}
