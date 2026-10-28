import {
  isBunqGrantRejected,
  useBunqAccounts,
  useDisconnectBunq,
  usePickBunqAccount,
} from '@shared/api/bunq-connection'
import { accountsShell } from '../lib/accounts-shell'
import { BunqAccountsView } from './BunqAccountsView'

/**
 * Container for a connected team's account pick and Disconnect: wires the accounts read and the two
 * mutations to the prop-only BunqAccountsView. Mounted only while connected, since the accounts are a
 * 404 otherwise. Pure wiring, covered by the View's stories and e2e (ADR-0017).
 */
export function BunqAccounts({ onDisconnected }: { onDisconnected: () => void }) {
  const accounts = useBunqAccounts()
  const pick = usePickBunqAccount()
  const disconnect = useDisconnectBunq(onDisconnected)
  const shell = accountsShell(accounts, disconnect.isPending || disconnect.isSuccess)

  return (
    <BunqAccountsView
      accounts={accounts.data?.accounts}
      selectedAccountId={accounts.data?.selectedAccountId}
      isLoading={shell.isLoading}
      isError={shell.isError}
      isSaving={pick.isPending || disconnect.isPending}
      saved={pick.isSuccess}
      rejected={isBunqGrantRejected(accounts.error) || isBunqGrantRejected(pick.error)}
      error={mutationError(pick.error, disconnect.error)}
      onPick={(accountId) => {
        disconnect.reset()
        pick.mutate(accountId)
      }}
      onDisconnect={() => disconnect.mutate()}
    />
  )
}

function mutationError(pickError: Error | null, disconnectError: Error | null) {
  if (disconnectError) return 'Couldn’t disconnect Bunq. Please try again.'
  // A rejected grant has its own message, which says to connect again.
  if (pickError && !isBunqGrantRejected(pickError)) return 'Couldn’t save the account. Please try again.'
  return null
}
