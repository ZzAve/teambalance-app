import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { MoneyPoolState, Payment } from '@shared/api/money-pool'
import { i18n } from '@shared/i18n/i18n'
import { ConnectedMoneyPool } from './ConnectedMoneyPool'
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
  /** Connecting Bunq is available here: an admin of a not-connected or rejected team is pointed to the team settings. */
  connectAvailable?: boolean
  /** Bunq is connected but no account is picked: an admin is pointed to the team settings to pick one. */
  accountPending?: boolean
}

function LoadError() {
  const { t } = useTranslation()
  return (
    <p role="alert" className="rounded-lg bg-card p-4 text-small text-red-ink">
      {t('moneyPool.loadFailed')}
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
  connectAvailable,
  accountPending,
}: MoneyPoolViewProps) {
  const { t } = useTranslation()
  if (isLoading) return <p role="status" className="text-small text-muted-foreground">{t('moneyPool.loading')}</p>
  if (isError || state === undefined) return <LoadError />
  if (state === 'Off') {
    // The route redirects an Off team away, but a stale session can still land here.
    return <MoneyPoolNotice title={t('moneyPool.off')} />
  }

  const linkHint = isAdmin && state === 'Connected' && <p className="text-small text-muted-foreground">{t('moneyPool.linkHint')}</p>
  const topUpEntry = canTopUp ? topUp : linkHint

  if (state === 'Connected') {
    return balance === undefined ? <LoadError /> : (
        <ConnectedMoneyPool
          balance={balance}
          payments={payments ?? []}
          beerPrice={beerPrice}
          beerCount={beerCount}
          topUp={topUpEntry}
        />
      )
  }

  return (
    <div className="flex flex-col gap-6">
      {state === 'NotConnected' ? (
        <NotConnectedMoneyPool isAdmin={isAdmin} connectAvailable={connectAvailable} accountPending={accountPending} />
      ) : (
        <MoneyPoolNotice
          title={t('moneyPool.unavailable')}
          body={state === 'Rejected' ? rejectedBody(isAdmin, connectAvailable) : t('moneyPool.unreachable')}
        />
      )}
      {topUpEntry}
    </div>
  )
}

function rejectedBody(isAdmin: boolean, connectAvailable?: boolean) {
  if (!isAdmin) return i18n.t('moneyPool.rejected.member')
  return connectAvailable === false ? i18n.t('moneyPool.rejected.reconnect') : i18n.t('moneyPool.rejected.reconnectInSettings')
}
