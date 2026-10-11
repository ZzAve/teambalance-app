import type { MoneyPoolState, Payment } from '@shared/api/money-pool'
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
}

const loadError = <p className="text-small text-destructive">We couldn't load the money pool. Try again in a moment.</p>

/**
 * The money pool for the current team, one picture per state (ADR-0042). Prop-only (ADR-0017): the
 * loading and error shells render from props so they can be shown without a network.
 */
export function MoneyPoolView({ state, isLoading, isError, isAdmin, balance, payments, beerPrice, beerCount }: MoneyPoolViewProps) {
  if (isLoading) return <p className="text-small text-muted-foreground">Loading…</p>
  if (isError || state === undefined) return loadError

  switch (state) {
    case 'Connected':
      return balance === undefined ? loadError : (
          <ConnectedMoneyPool balance={balance} payments={payments ?? []} beerPrice={beerPrice} beerCount={beerCount} />
        )
    case 'NotConnected':
      return <NotConnectedMoneyPool isAdmin={isAdmin} />
    case 'Unavailable':
      return (
        <MoneyPoolNotice
          title="The pool is unavailable right now"
          body="We can't reach the team's Bunq account. Try again later."
        />
      )
    case 'Off':
      // The route redirects an Off team away, but a stale session can still land here.
      return <MoneyPoolNotice title="The money pool is switched off for this team" />
  }
}
