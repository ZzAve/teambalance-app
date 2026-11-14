import type { CSSProperties, ReactNode } from 'react'
import { Beer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { balanceTimeline, potTotals } from '../lib/balance-timeline'
import { BalanceGraph } from './BalanceGraph'
import { formatBeers, formatEuro } from '../lib/format'
import { toppedUpTotal } from '../lib/toppers'
import { PaymentListView } from './PaymentListView'
import { ToppersView } from './ToppersView'

interface ConnectedMoneyPoolProps {
  balance: number
  payments: Payment[]
  /** Euro cents; with `beerCount`, set only when the team configured a beer price. */
  beerPrice?: number
  beerCount?: number
  /** The top-up button or hint, shown right under the balance. */
  topUp?: ReactNode
  /** The button that records an out-of-pocket expense, shown under the top-up. */
  recordExpense?: ReactNode
  /** The delete control on an out-of-pocket expense (null for none), supplied by the container. */
  deleteExpense?: (expense: Payment) => ReactNode
  /** The receipt control shown on each expense, supplied by the container. */
  receipt?: (expense: Payment) => ReactNode
  /** The claim control on an incoming payment (null for none), supplied by the container. */
  claim?: (payment: Payment) => ReactNode
  /** Whether the payments run from the team's season start (true) or the last 90 days (false); undefined until the season is known. */
  seasonSet?: boolean
  /** ISO calendar date of today, for the Toppers' Last 30 days. */
  today: string
  /** The team roster, to name and show the Toppers and the faces on the payments. */
  /** Undefined until the roster is loaded: the Toppers wait for it, so no one shows as a former member meanwhile. */
  members: Member[] | undefined
  /** The viewer's member id, marked in the Toppers; absent when the viewer is not a member. */
  youId?: string
}

/** The count-up animates a registered custom property, so it needs @property support. */
const CAN_COUNT_UP = typeof CSS !== 'undefined' && 'registerProperty' in CSS

export function ConnectedMoneyPool({ balance, payments, beerPrice, beerCount, topUp, recordExpense, deleteExpense, receipt, claim, seasonSet, today, members, youId }: ConnectedMoneyPoolProps) {
  const { t } = useTranslation()
  const points = balanceTimeline(balance, payments)
  const { incoming, outgoing } = potTotals(payments)
  return (
    <div className="flex flex-col gap-6">
      <section aria-label={t('money.balance')} className="rounded-lg bg-card p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{t('money.poolBalance')}</p>
        <p className="font-display text-page font-extrabold leading-none">{formatEuro(balance)}</p>
        {beerPrice !== undefined && beerCount !== undefined && (
          // The number counts up from 0 on first render (global.css .beer-count; off under prefers-reduced-motion).
          <div role="group" aria-label={t('money.beerCounter')} className="mt-2 flex items-center gap-2">
            <Beer size={18} className="shrink-0 text-blue" aria-hidden="true" />
            <p className="text-small text-muted-foreground" aria-hidden="true">
              ≈ <span className={`beer-count ${CAN_COUNT_UP ? 'beer-count-up ' : ''}font-display text-body font-bold text-foreground`} style={{ '--beer-n': beerCount } as CSSProperties} />{' '}
              {t('money.beersInPot', { count: beerCount })} <span className="text-caption">· {t('money.beerEach', { price: formatEuro(beerPrice) })}</span>
            </p>
            <p className="sr-only">{t('money.beerCovers', { beers: formatBeers(beerCount), price: formatEuro(beerPrice) })}</p>
          </div>
        )}
        {payments.length > 0 && (
          <>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 text-caption text-muted-foreground">
              <dl className="flex flex-wrap gap-x-4">
                <div className="flex gap-1">
                  <dt>{t('money.totalIn')}</dt>
                  <dd className="font-bold tabular-nums text-foreground">{formatEuro(incoming)}</dd>
                </div>
                <div className="flex gap-1">
                  <dt>{t('money.toppedUp')}</dt>
                  <dd className="font-bold tabular-nums text-foreground">{formatEuro(toppedUpTotal(payments))}</dd>
                </div>
                <div className="flex gap-1">
                  <dt>{t('money.totalSpent')}</dt>
                  <dd className="font-bold tabular-nums text-foreground">{formatEuro(outgoing)}</dd>
                </div>
              </dl>
              {seasonSet !== undefined && <p className="ml-auto">{seasonSet ? t('money.thisSeason') : t('money.last90Days')}</p>}
            </div>
            <div className="mt-2">
              <BalanceGraph points={points} />
            </div>
          </>
        )}
      </section>

      {(topUp || recordExpense) && (
        <div className="flex flex-col gap-3">
          {topUp}
          {recordExpense}
        </div>
      )}

      <PaymentListView payments={payments} members={members} youId={youId} receipt={receipt} claim={claim} deleteExpense={deleteExpense} />

      {payments.length > 0 && members && <ToppersView payments={payments} today={today} members={members} seasonSet={seasonSet} youId={youId} />}
    </div>
  )
}
