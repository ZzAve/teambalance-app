import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight, Beer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { balanceTimeline, potTotals } from '../lib/balance-timeline'
import { BalanceGraph } from './BalanceGraph'
import { formatBeers, formatEuro, formatPaymentDate } from '../lib/format'
import { toppedUpTotal } from '../lib/toppers'
import { ToppersView } from './ToppersView'

interface ConnectedMoneyPoolProps {
  balance: number
  payments: Payment[]
  /** Euro cents; with `beerCount`, set only when the team configured a beer price. */
  beerPrice?: number
  beerCount?: number
  /** The top-up button or hint, shown right under the balance. */
  topUp?: ReactNode
  /** The receipt control shown on each expense, supplied by the container. */
  receipt?: (expense: Payment) => ReactNode
  /** The claim control on an incoming payment (null for none), supplied by the container. */
  claim?: (payment: Payment) => ReactNode
  /** Whether the payments run from the team's season start (true) or the last 90 days (false); undefined until the season is known. */
  seasonSet?: boolean
  /** ISO calendar date of today, for the Toppers' Last 30 days. */
  today: string
  /** The team roster, to name and show the Toppers. */
  /** Undefined until the roster is loaded: the Toppers wait for it, so no one shows as a former member meanwhile. */
  members: Member[] | undefined
}

/** The count-up animates a registered custom property, so it needs @property support. */
const CAN_COUNT_UP = typeof CSS !== 'undefined' && 'registerProperty' in CSS

/** The payments shown before "Show all". */
const PAYMENTS_SHOWN = 15

export function ConnectedMoneyPool({ balance, payments, beerPrice, beerCount, topUp, receipt, claim, seasonSet, today, members }: ConnectedMoneyPoolProps) {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const points = balanceTimeline(balance, payments)
  const { incoming, outgoing } = potTotals(payments)
  const shown = showAll ? payments : payments.slice(0, PAYMENTS_SHOWN)
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

      {topUp}

      <section aria-label={t('money.payments')}>
        <h3 className="font-display mb-2 text-body font-bold">{t('money.payments')}</h3>
        {payments.length === 0 ? (
          <p className="text-small text-muted-foreground">{t('money.noPayments')}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-lg bg-card">
            {shown.map((payment) => {
              const isIncoming = payment.direction === 'In'
              const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight
              // The row is focusable so focus can land on it after a claim removes its button.
              return (
                <li key={payment.id} tabIndex={-1} className="flex items-center gap-3 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                  <Icon size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-semibold">{payment.name}</span>
                    <span className="text-caption text-muted-foreground">{formatPaymentDate(payment.date)}</span>
                  </span>
                  <span className="text-small font-semibold tabular-nums">
                    <span className="sr-only">{`${isIncoming ? t('money.incoming') : t('money.outgoing')} `}</span>
                    <span aria-hidden="true">{isIncoming ? '+' : '−'}</span>
                    {formatEuro(payment.amount)}
                  </span>
                  {/* An incoming payment without a claim control keeps the receipt's width free, so the amounts stay in one column. */}
                  {(receipt || claim) &&
                    (isIncoming ? (claim?.(payment) ?? <span className="w-10 shrink-0" aria-hidden="true" />) : receipt?.(payment))}
                </li>
              )
            })}
          </ul>
        )}
        {payments.length > PAYMENTS_SHOWN && (
          <Button variant="ghost" size="sm" className="mt-2 w-full" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? t('money.showFewer') : t('money.showAll', { count: payments.length })}
          </Button>
        )}
      </section>

      {payments.length > 0 && members && <ToppersView payments={payments} today={today} members={members} seasonSet={seasonSet} />}
    </div>
  )
}
