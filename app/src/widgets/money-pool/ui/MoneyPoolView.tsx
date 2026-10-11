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
}

/**
 * The money pool for the current team, one picture per state (ADR-0042). Prop-only (ADR-0017): the
 * loading and error shells render from props so they can be shown without a network.
 */
export function MoneyPoolView({ state, isLoading, isError, isAdmin, balance, payments }: MoneyPoolViewProps) {
  if (isLoading) return <p className="text-small text-muted-foreground">Loading…</p>
  if (isError || state === undefined) {
    return <p className="text-small text-destructive">We couldn't load the money pool. Try again in a moment.</p>
  }

  switch (state) {
    case 'Connected':
      return <ConnectedMoneyPool balance={balance ?? 0} payments={payments ?? []} />
    case 'NotConnected':
      return <NotConnectedMoneyPool isAdmin={isAdmin} />
    case 'Unavailable':
      return (
        <MoneyPoolNotice
          title="The pool is unavailable right now"
          body={
            isAdmin
              ? "We can't reach the team's Bunq account. Try again later, or reconnect it."
              : "We can't reach the team's Bunq account. Try again later."
          }
        />
      )
    case 'Off':
      return <MoneyPoolNotice title="The money pool is switched off" body="An admin can switch it on for the team." />
  }
}
