import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@shared/api/auth'
import { useMembers } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { formatEuro } from '@entities/payment/lib/format-euro'
import { PaymentAliasError, useClaimPayment } from '@shared/api/payment-aliases'
import { ClaimPaymentView } from './ClaimPaymentView'

/**
 * Container for "That's mine" / "Assign to…" on one unattributed incoming payment: the claim
 * mutation and the success toast behind the prop-only ClaimPaymentView. Rendered by MoneyPool for the
 * variant claimVariant() picks. Pure wiring
 * (ADR-0017); no e2e: the PR gate sees no new seam in it.
 */
export function ClaimPayment({ payment, variant }: { payment: Payment; variant: 'member' | 'admin' }) {
  return variant === 'admin' ? <AdminClaim payment={payment} /> : <MemberClaim payment={payment} />
}

function MemberClaim({ payment }: { payment: Payment }) {
  const user = useCurrentUser()
  // Never undefined here: the slot only renders for a signed-in user.
  return <Claim payment={payment} variant="member" userId={user?.id ?? ''} names={user ? { [user.id]: user.displayName } : {}} />
}

function AdminClaim({ payment }: { payment: Payment }) {
  // Current members only: a substitute has no account to claim for (ADR-0033). Rows share one query.
  const members = useMembers().data ?? []
  return <Claim payment={payment} variant="admin" userId="" members={members} names={Object.fromEntries(members.map((m) => [m.userId, m.displayName]))} />
}

function Claim({
  payment,
  variant,
  userId,
  members,
  names,
}: {
  payment: Payment
  variant: 'member' | 'admin'
  userId: string
  members?: { userId: string; displayName: string }[]
  names: Record<string, string>
}) {
  const { t } = useTranslation()
  const claim = useClaimPayment()

  return (
    <ClaimPaymentView
      variant={variant}
      userId={userId}
      members={members}
      name={payment.name}
      amount={formatEuro(payment.amount)}
      isSaving={claim.isPending}
      error={claim.error ? (claim.error instanceof PaymentAliasError ? claim.error.code : 'FAILED') : undefined}
      onDismissError={() => claim.reset()}
      onClaim={async (request) => {
        const alias = await claim.mutateAsync({ paymentId: payment.id, ...request })
        toast.success(
          t('claim.done', {
            who: names[request.userId] ?? '',
            alias: [alias.name, alias.ibanMasked].filter(Boolean).join(', '),
          }),
        )
      }}
    />
  )
}
