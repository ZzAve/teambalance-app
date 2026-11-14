import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { formatEuro } from '../lib/format'
import { PaymentListView } from './PaymentListView'
import { ToppersView } from './ToppersView'

interface MemberExpensesProps {
  /** The out-of-pocket expenses, newest first; at least one. */
  payments: Payment[]
  /** A Bunq Connection exists but cannot be read now, so the bank's payments are absent from the list and the ranking. */
  bankPaymentsMissing: boolean
  /** The control that changes or deletes an expense (null for none), supplied by the container. */
  editExpense?: (expense: Payment) => ReactNode
  /** The receipt control on each expense, supplied by the container. */
  receipt?: (expense: Payment) => ReactNode
  /** Whether the expenses run from the team's season start (true) or the last 90 days (false); undefined until the season is known. */
  seasonSet?: boolean
  /** ISO calendar date of today, for the Toppers' Last 30 days. */
  today: string
  /** Undefined until the roster is loaded: the Toppers wait for it. */
  members: Member[] | undefined
  /** The viewer's member id; absent when the viewer is not a member. */
  youId?: string
}

/**
 * What the money pool shows without a working Bunq connection (ADR-0048): what members paid with their own
 * money, and who paid most. There is no balance: only Bunq knows it.
 */
export function MemberExpenses({ payments, bankPaymentsMissing, editExpense, receipt, seasonSet, today, members, youId }: MemberExpensesProps) {
  const { t } = useTranslation()
  const total = payments.reduce((sum, p) => sum + p.amount, 0)
  return (
    <>
      {bankPaymentsMissing && (
        <section aria-labelledby="bank-payments-missing" className="flex gap-3 rounded-lg border border-gold/50 bg-gold/10 p-4">
          <TriangleAlert size={20} className="mt-0.5 shrink-0" style={{ color: 'var(--color-gold-dark)' }} aria-hidden="true" />
          <div>
            <h3 id="bank-payments-missing" className="text-small font-bold">
              {t('money.bankMissing.title')}
            </h3>
            <p className="mt-1 text-small text-muted-foreground">{t('money.bankMissing.body')}</p>
          </div>
        </section>
      )}

      <section aria-label={t('money.paidByMembers')} className="rounded-lg bg-card p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{t('money.paidByMembers')}</p>
        <p className="font-display text-page font-extrabold leading-none">{formatEuro(total)}</p>
        {seasonSet !== undefined && <p className="mt-2 text-caption text-muted-foreground">{seasonSet ? t('money.thisSeason') : t('money.last90Days')}</p>}
      </section>

      <PaymentListView payments={payments} members={members} youId={youId} receipt={receipt} editExpense={editExpense} />

      {members && <ToppersView payments={payments} today={today} members={members} seasonSet={seasonSet} youId={youId} />}
    </>
  )
}
