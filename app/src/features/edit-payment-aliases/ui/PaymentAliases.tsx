import { PaymentAliasError, useCreatePaymentAlias, useDeletePaymentAlias, usePaymentAliases } from '@shared/api/payment-aliases'
import { useMoneyPool } from '@shared/api/money-pool'
import { PaymentAliasesView, type PaymentAliasErrorCode } from './PaymentAliasesView'

/**
 * Container for one member's payment aliases: the list query and the create/delete mutations behind
 * the prop-only PaymentAliasesView. Rendered only for the member and Admins (the list is 403 for
 * anyone else), so it fetches unconditionally. The "matches N payments" preview reads the money-pool
 * query the Money tab already fills. Pure wiring, covered by e2e rather than a story (ADR-0017).
 */
export function PaymentAliases({ userId }: { userId: string }) {
  const aliases = usePaymentAliases(userId)
  const pool = useMoneyPool()
  const create = useCreatePaymentAlias(userId)
  const remove = useDeletePaymentAlias(userId)

  const failed = create.error ?? remove.error
  const errorCode: PaymentAliasErrorCode | null = failed
    ? failed instanceof PaymentAliasError
      ? failed.code
      : 'FAILED'
    : null

  return (
    <PaymentAliasesView
      aliases={aliases.data}
      payments={pool.data?.payments ?? []}
      isLoading={aliases.isLoading}
      isError={aliases.isError}
      isSaving={create.isPending || remove.isPending}
      errorCode={errorCode}
      onRetry={() => aliases.refetch()}
      onDismissError={() => {
        create.reset()
        remove.reset()
      }}
      onCreate={(alias) => {
        remove.reset()
        return create.mutateAsync(alias)
      }}
      onDelete={(alias) => {
        create.reset()
        remove.mutate({ aliasId: alias.id })
      }}
    />
  )
}
