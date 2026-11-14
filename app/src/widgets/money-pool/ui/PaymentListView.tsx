import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { formatEuro, formatPaymentWeekday } from '../lib/format'
import { MemberAvatar } from './MemberAvatar'

interface PaymentListViewProps {
  /** Newest first, as the pool returns them. */
  payments: Payment[]
  /** The team roster, for the face and name on a top-up; undefined while it loads. */
  members: Member[] | undefined
  /** The viewer's member id, marked "(you)"; absent when the viewer is not a member. */
  youId?: string
  /** The receipt control shown on each expense, supplied by the container. */
  receipt?: (expense: Payment) => ReactNode
  /** The claim control on an incoming payment (null for none), supplied by the container. */
  claim?: (payment: Payment) => ReactNode
  /** The control that changes or deletes an out-of-pocket expense (null for none), supplied by the container. */
  editExpense?: (expense: Payment) => ReactNode
}

/** The payments shown before "Show all". */
const PAYMENTS_SHOWN = 15

/** The pool's payments in one card, newest first. */
export function PaymentListView({ payments, members, youId, receipt, claim, editExpense }: PaymentListViewProps) {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const memberById = useMemo(() => new Map((members ?? []).map((m) => [m.userId, m])), [members])
  const shown = showAll ? payments : payments.slice(0, PAYMENTS_SHOWN)

  return (
    <section aria-label={t('money.payments')}>
      <h3 className="font-display mb-2 text-body font-bold">{t('money.payments')}</h3>
      {payments.length === 0 ? (
        <p className="text-small text-muted-foreground">{t('money.noPayments')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-lg bg-card">
          {shown.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} member={payment.memberId ? memberById.get(payment.memberId) : undefined} youId={youId} receipt={receipt} claim={claim} editExpense={editExpense} />
          ))}
        </ul>
      )}
      {payments.length > PAYMENTS_SHOWN && (
        <Button variant="ghost" size="sm" className="mt-2 w-full" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? t('money.showFewer') : t('money.showAll', { count: payments.length })}
        </Button>
      )}
    </section>
  )
}

function PaymentRow({
  payment,
  member,
  youId,
  receipt,
  claim,
  editExpense,
}: Pick<PaymentListViewProps, 'youId' | 'receipt' | 'claim' | 'editExpense'> & { payment: Payment; member: Member | undefined }) {
  const { t } = useTranslation()
  const isIncoming = payment.direction === 'In'
  const memberName = member && (member.userId === youId ? t('money.toppers.self', { name: member.displayName }) : member.displayName)
  // An out-of-pocket expense names the member who paid, or says a member did when they have left the team.
  // Any other payment shows the roster name, unless it only repeats the payment's own name.
  const who = payment.outOfPocket
    ? memberName
      ? t('money.paidBy', { name: memberName })
      : t('money.paidOutOfPocket')
    : member?.displayName !== payment.name && memberName
  // An out-of-pocket expense did not change the balance, so its amount has no sign and no colour.
  const amountLabel = payment.outOfPocket ? t('money.outOfPocket') : isIncoming ? t('money.incoming') : t('money.outgoing')
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
      <span className={`text-small font-semibold tabular-nums ${payment.outOfPocket ? '' : isIncoming ? 'text-green-ink' : 'text-orange-ink'}`}>
        <span className="sr-only">{`${amountLabel} `}</span>
        {!payment.outOfPocket && <span aria-hidden="true">{isIncoming ? '+' : '−'}</span>}
        {formatEuro(payment.amount)}
      </span>
      {/* An incoming payment without a claim control keeps the receipt's width free, so the amounts stay in one column. */}
      {(receipt || claim) && (isIncoming ? (claim?.(payment) ?? <span className="w-10 shrink-0" aria-hidden="true" />) : receipt?.(payment))}
      {payment.outOfPocket && editExpense?.(payment)}
    </li>
  )
}
