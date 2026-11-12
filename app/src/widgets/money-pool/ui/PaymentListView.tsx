import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { formatEuro, formatPaymentWeekday } from '../lib/format'
import { firstWeeks, formatNet, paymentWeeks, weekLabel } from '../lib/payment-weeks'
import { MemberAvatar } from './MemberAvatar'

interface PaymentListViewProps {
  /** Newest first, as the pool returns them. */
  payments: Payment[]
  /** ISO calendar date of today, for "This week" and "Last week". */
  today: string
  /** The team roster, for the face and name on a top-up; undefined while it loads. */
  members: Member[] | undefined
  /** The viewer's member id, marked "(you)"; absent when the viewer is not a member. */
  youId?: string
  /** The receipt control shown on each expense, supplied by the container. */
  receipt?: (expense: Payment) => ReactNode
  /** The claim control on an incoming payment (null for none), supplied by the container. */
  claim?: (payment: Payment) => ReactNode
}

/** At least this many payments show before "Show all"; the list stops at the end of a week. */
const PAYMENTS_SHOWN = 15

/** The pool's payments by week (Monday start), newest first, each week under a sticky header with its net. */
export function PaymentListView({ payments, today, members, youId, receipt, claim }: PaymentListViewProps) {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const memberById = useMemo(() => new Map((members ?? []).map((m) => [m.userId, m])), [members])
  const weeks = paymentWeeks(payments)
  const collapsed = firstWeeks(weeks, PAYMENTS_SHOWN)
  const shown = showAll ? weeks : collapsed
  const collapsedCount = collapsed.reduce((sum, w) => sum + w.payments.length, 0)

  return (
    <section aria-label={t('money.payments')}>
      <h3 className="font-display mb-2 text-body font-bold">{t('money.payments')}</h3>
      {payments.length === 0 ? (
        <p className="text-small text-muted-foreground">{t('money.noPayments')}</p>
      ) : (
        shown.map((week) => (
          <div key={week.monday}>
            {/* Sticks under the app header while its week scrolls by; its parent ends the stick at the week's end. */}
            <h4 className="sticky top-[var(--header-height)] z-10 flex items-baseline justify-between gap-2 bg-background px-1 pt-3.5 pb-1.5 text-caption font-bold uppercase tracking-wide text-muted-foreground">
              <span>{weekLabel(week.monday, today)}</span>
              <span className="font-semibold normal-case tracking-normal tabular-nums">
                <span className="sr-only">{`${t('money.weekNet')} `}</span>
                {formatNet(week.net)}
              </span>
            </h4>
            <ul className="flex flex-col divide-y divide-border rounded-lg bg-card">
              {week.payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} member={payment.memberId ? memberById.get(payment.memberId) : undefined} youId={youId} receipt={receipt} claim={claim} />
              ))}
            </ul>
          </div>
        ))
      )}
      {payments.length > collapsedCount && (
        <Button variant="ghost" size="sm" className="mt-2 w-full" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? t('money.showFewer') : t('money.showAll', { count: payments.length })}
        </Button>
      )}
    </section>
  )
}

function PaymentRow({ payment, member, youId, receipt, claim }: Pick<PaymentListViewProps, 'youId' | 'receipt' | 'claim'> & { payment: Payment; member: Member | undefined }) {
  const { t } = useTranslation()
  const isIncoming = payment.direction === 'In'
  // The roster name, unless it only repeats the payment's own name.
  const who = member && (member.userId === youId ? t('money.toppers.self', { name: member.displayName }) : member.displayName !== payment.name && member.displayName)
  return (
    // The row is focusable so focus can land on it after a claim removes its button.
    <li tabIndex={-1} className="flex items-center gap-3 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
      {payment.memberId ? (
        // Decorative: the name is on the row, so screen readers skip the initials.
        <span aria-hidden="true" className="shrink-0">
          <MemberAvatar memberId={payment.memberId} member={member} name={member?.displayName ?? payment.name} />
        </span>
      ) : (
        <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isIncoming ? 'bg-green/15 text-green-ink' : 'bg-orange/15 text-orange-ink'}`}>
          {isIncoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-small font-semibold">{payment.name}</span>
        <span className="block truncate text-caption text-muted-foreground">{[who, formatPaymentWeekday(payment.date)].filter(Boolean).join(' · ')}</span>
      </span>
      <span className={`text-small font-semibold tabular-nums ${isIncoming ? 'text-green-ink' : 'text-orange-ink'}`}>
        <span className="sr-only">{`${isIncoming ? t('money.incoming') : t('money.outgoing')} `}</span>
        <span aria-hidden="true">{isIncoming ? '+' : '−'}</span>
        {formatEuro(payment.amount)}
      </span>
      {/* An incoming payment without a claim control keeps the receipt's width free, so the amounts stay in one column. */}
      {(receipt || claim) && (isIncoming ? (claim?.(payment) ?? <span className="w-10 shrink-0" aria-hidden="true" />) : receipt?.(payment))}
    </li>
  )
}
