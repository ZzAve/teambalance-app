import { useId, useState } from 'react'
import type { BunqAccount } from '@shared/api/bunq-connection'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'

interface BunqAccountsViewProps {
  /** The accounts the team's Bunq access covers; undefined until they are read. */
  accounts?: BunqAccount[]
  /** The account the Money page reads; undefined until the Admin picks one. */
  selectedAccountId?: string
  isLoading?: boolean
  /** The accounts could not be read. */
  isError?: boolean
  /** A pick or a disconnect is in flight. */
  isSaving?: boolean
  /** The stored access cannot be used any more (422): the Admin has to connect again. */
  rejected?: boolean
  /** A pick or a disconnect failed, shown inline. */
  error?: string | null
  onPick: (accountId: string) => void
  onDisconnect: () => void
}

// Error texts sit on a card; red-ink clears 4.5:1 there in both themes.
const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'

/**
 * Presentational account picker and Disconnect for a connected team: one list of the accounts the
 * Money page can read, with the picked one checked. Owns only the choice that has not been saved yet and
 * the Disconnect confirmation. The reads and the mutations live in the BunqAccounts container; the
 * loading, error and rejected shells are props-driven so they render as stories without a network.
 */
export function BunqAccountsView({
  accounts,
  selectedAccountId,
  isLoading,
  isError,
  isSaving,
  rejected,
  error,
  onPick,
  onDisconnect,
}: BunqAccountsViewProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <p role="status" className="text-small text-muted-foreground">
          Loading the bunq accounts…
        </p>
      )}
      {rejected ? (
        <p role="alert" className={ERROR_CLASS}>
          TeamBalance can’t use its stored bunq access any more. Use “Connect a different bunq login” below to
          connect again, or disconnect.
        </p>
      ) : (
        isError && (
          <p role="alert" className={ERROR_CLASS}>
            Couldn’t load the bunq accounts. Please try again.
          </p>
        )
      )}
      {accounts && !isLoading && !isError && (
        <AccountPicker accounts={accounts} selectedAccountId={selectedAccountId} isSaving={isSaving} onPick={onPick} />
      )}
      {error && (
        <p role="alert" className={ERROR_CLASS}>
          {error}
        </p>
      )}

      <div>
        <Button variant="outline" disabled={isSaving} onClick={() => setConfirming(true)}>
          Disconnect
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Disconnect Bunq"
        description="This deletes the access TeamBalance stored. To withdraw the grant at bunq too, remove TeamBalance under connected apps in the bunq app."
        confirmLabel="Disconnect"
        onConfirm={() => {
          setConfirming(false)
          onDisconnect()
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}

type AccountPickerProps = Pick<BunqAccountsViewProps, 'selectedAccountId' | 'isSaving' | 'onPick'> & {
  accounts: BunqAccount[]
}

function AccountPicker({ accounts, selectedAccountId, isSaving, onPick }: AccountPickerProps) {
  const groupName = useId()
  const [choice, setChoice] = useState(selectedAccountId)

  if (accounts.length === 0) {
    return <p className="text-small text-muted-foreground">This bunq login has no accounts to show.</p>
  }

  return (
    <fieldset className="flex flex-col gap-1" disabled={isSaving}>
      <legend className="text-small font-semibold">
        {selectedAccountId ? 'The Money page shows this account' : 'Pick the account the Money page shows'}
      </legend>
      {accounts.map((account) => (
        <label key={account.id} className="flex min-h-11 items-center gap-3 py-2 text-small">
          <input
            type="radio"
            name={groupName}
            value={account.id}
            checked={choice === account.id}
            onChange={() => setChoice(account.id)}
            className="size-5 shrink-0 accent-primary"
          />
          {account.name}
        </label>
      ))}
      <div className="mt-2">
        <Button disabled={isSaving || choice === undefined || choice === selectedAccountId} onClick={() => choice && onPick(choice)}>
          {isSaving ? 'Saving…' : 'Use this account'}
        </Button>
      </div>
    </fieldset>
  )
}
