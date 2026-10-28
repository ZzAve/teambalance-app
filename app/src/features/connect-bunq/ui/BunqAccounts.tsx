import {
  isBunqGrantRejected,
  useBunqAccounts,
  useDisconnectBunq,
  usePickBunqAccount,
} from '@shared/api/bunq-connection'
import { BunqAccountsView } from './BunqAccountsView'

/**
 * Container for a connected team's account pick and Disconnect: wires the accounts read and the two
 * mutations to the prop-only BunqAccountsView. Mounted only while connected, since the accounts are a
 * 404 otherwise. Pure wiring, covered by the View's stories and e2e (ADR-0017).
 */
export function BunqAccounts() {
  const accounts = useBunqAccounts()
  const pick = usePickBunqAccount()
  const disconnect = useDisconnectBunq()
  // A retry after a failure is a fetch in error status, and a paused one is neither fetching nor failed.
  const failed = accounts.isError && !accounts.isFetching

  return (
    <BunqAccountsView
      accounts={accounts.data?.accounts}
      selectedAccountId={accounts.data?.selectedAccountId}
      isLoading={!accounts.isSuccess && !failed}
      isError={failed}
      isSaving={pick.isPending || disconnect.isPending}
      rejected={isBunqGrantRejected(accounts.error) || isBunqGrantRejected(pick.error)}
      error={mutationError(pick.error, disconnect.error)}
      onPick={(accountId) => pick.mutate(accountId)}
      onDisconnect={() => disconnect.mutate()}
    />
  )
}

function mutationError(pickError: Error | null, disconnectError: Error | null) {
  if (disconnectError) return 'Couldn’t disconnect Bunq. Please try again.'
  // A rejected grant has its own message, with the way out.
  if (pickError && !isBunqGrantRejected(pickError)) return 'Couldn’t save the account. Please try again.'
  return null
}
