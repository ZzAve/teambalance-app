import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Payment } from '@shared/api/money-pool'
import { formatEuro, formatPaymentDate } from '../lib/format'

export function ConnectedMoneyPool({ balance, payments }: { balance: number; payments: Payment[] }) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Balance" className="rounded-lg bg-card p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">Pool balance</p>
        <p className="font-display mt-1 text-page font-extrabold leading-none">{formatEuro(balance)}</p>
      </section>

      <section aria-label="Payments">
        <h3 className="font-display mb-2 text-body font-bold">Payments</h3>
        {payments.length === 0 ? (
          <p className="text-small text-muted-foreground">No payments in this period.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-lg bg-card">
            {payments.map((payment) => {
              const incoming = payment.direction === 'In'
              const Icon = incoming ? ArrowDownLeft : ArrowUpRight
              return (
                <li key={`${payment.date}-${payment.name}-${payment.amount}`} className="flex items-center gap-3 px-4 py-3">
                  <Icon size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-semibold">{payment.name}</span>
                    <span className="text-caption text-muted-foreground">{formatPaymentDate(payment.date)}</span>
                  </span>
                  <span className="text-small font-semibold tabular-nums">
                    {incoming ? '+' : '−'}
                    {formatEuro(payment.amount)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
