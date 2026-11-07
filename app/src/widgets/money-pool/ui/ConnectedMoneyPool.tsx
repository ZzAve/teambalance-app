import type { ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Payment } from '@shared/api/money-pool'
import { formatBeers, formatEuro, formatPaymentDate } from '../lib/format'

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
}

export function ConnectedMoneyPool({ balance, payments, beerPrice, beerCount, topUp, receipt }: ConnectedMoneyPoolProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6">
      <section aria-label={t('money.balance')} className="rounded-lg bg-card p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{t('money.poolBalance')}</p>
        <p className="font-display mt-1 text-page font-extrabold leading-none">{formatEuro(balance)}</p>
      </section>

      {topUp}

      {beerPrice !== undefined && beerCount !== undefined && (
        <section aria-label={t('money.beerCounter')} className="rounded-lg bg-card p-4">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{t('money.beerCounter')}</p>
          <p className="font-display mt-1 text-title font-bold leading-none">{formatBeers(beerCount)}</p>
          <p className="mt-1 text-caption text-muted-foreground">
            {t('money.beerCovers', { beers: formatBeers(beerCount), price: formatEuro(beerPrice) })}
          </p>
        </section>
      )}

      <section aria-label={t('money.payments')}>
        <h3 className="font-display mb-2 text-body font-bold">{t('money.payments')}</h3>
        {payments.length === 0 ? (
          <p className="text-small text-muted-foreground">{t('money.noPayments')}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-lg bg-card">
            {payments.map((payment) => {
              const incoming = payment.direction === 'In'
              const Icon = incoming ? ArrowDownLeft : ArrowUpRight
              return (
                <li key={payment.id} className="flex items-center gap-3 px-4 py-3">
                  <Icon size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-semibold">{payment.name}</span>
                    <span className="text-caption text-muted-foreground">{formatPaymentDate(payment.date)}</span>
                  </span>
                  <span className="text-small font-semibold tabular-nums">
                    <span className="sr-only">{`${incoming ? t('money.incoming') : t('money.outgoing')} `}</span>
                    <span aria-hidden="true">{incoming ? '+' : '−'}</span>
                    {formatEuro(payment.amount)}
                  </span>
                  {/* An incoming payment keeps the receipt's width free, so the amounts stay in one column. */}
                  {receipt && (incoming ? <span className="w-10 shrink-0" aria-hidden="true" /> : receipt(payment))}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
