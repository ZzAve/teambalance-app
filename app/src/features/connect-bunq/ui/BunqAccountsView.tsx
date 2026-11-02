import { useEffect, useId, useRef, useState } from 'react'
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
  /** The last pick went through: announced, and focus moves to the announcement. */
  saved?: boolean
  /** The stored access cannot be used any more (422): the Admin has to connect again. */
  rejected?: boolean
  /** A pick or a disconnect failed, shown inline. */
  error?: string | null
  onPick: (accountId: string) => void
  onDisconnect: () => void
}

// Drawn by hand: the native unchecked radio is a dark disc with a faint ring in the dark theme. The ring is
// muted-foreground (4.7:1 light, 7.3:1 dark against the page; 3:1 is the floor for a control's boundary) and
// the checked one is a solid primary disc with a dot cut out of it.
const RADIO_CLASS = [
  'size-5 shrink-0 appearance-none rounded-full border-2 border-muted-foreground bg-transparent',
  'checked:border-primary checked:bg-primary',
  'checked:bg-[radial-gradient(circle,var(--color-primary-foreground)_0_32%,transparent_36%)]',
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')

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
  saved,
  rejected,
  error,
  onPick,
  onDisconnect,
}: BunqAccountsViewProps) {
  const [confirming, setConfirming] = useState(false)
  const disconnectButton = useRef<HTMLButtonElement>(null)
  // Focus goes back to Disconnect only when the dialog was dismissed. After a confirm the button is disabled
  // and the status or the error takes focus, which must not be pulled away when the dialog finishes closing.
  const dismissed = useRef(false)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const rejectedRef = useRef<HTMLParagraphElement>(null)
  // Set once the Admin has pressed something here. A rejection that follows is the answer to that press, and
  // the button they pressed is about to go; a connection that was already rejected on arrival keeps focus where it is.
  const acted = useRef(false)

  useEffect(() => {
    if (rejected && acted.current) rejectedRef.current?.focus()
  }, [rejected])

  // A failed pick or disconnect leaves the controls that were pressed disabled and focus on the page; the
  // error is where it goes. The message returns to null while the next attempt is pending, so a repeated
  // failure runs this again.
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <p role="status" className="text-small text-muted-foreground">
          Loading the bunq accounts…
        </p>
      )}
      {rejected ? (
        <p ref={rejectedRef} role="alert" tabIndex={-1} className={`${ERROR_CLASS} outline-none`}>
          TeamBalance can’t use its stored bunq access any more. Use “Connect a different bunq login” below, or
          disconnect.
        </p>
      ) : (
        isError && (
          <p role="alert" className={ERROR_CLASS}>
            Couldn’t load the bunq accounts. Please try again.
          </p>
        )
      )}
      {accounts && !isLoading && !isError && (
        <AccountPicker
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          isSaving={isSaving}
          saved={saved}
          onPick={(accountId) => {
            acted.current = true
            onPick(accountId)
          }}
        />
      )}
      {error && (
        <p ref={errorRef} role="alert" tabIndex={-1} className={`${ERROR_CLASS} outline-none`}>
          {error}
        </p>
      )}

      <div>
        <Button ref={disconnectButton} variant="outline" size="sm" disabled={isSaving} onClick={() => setConfirming(true)}>
          Disconnect
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Disconnect Bunq"
        description="This deletes the access TeamBalance stored. To withdraw the grant at bunq too, remove TeamBalance under connected apps in the bunq app."
        confirmLabel="Disconnect"
        onConfirm={() => {
          dismissed.current = false
          acted.current = true
          setConfirming(false)
          onDisconnect()
        }}
        onCancel={() => {
          dismissed.current = true
          setConfirming(false)
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (dismissed.current) disconnectButton.current?.focus()
        }}
      />
    </div>
  )
}

type AccountPickerProps = Pick<BunqAccountsViewProps, 'selectedAccountId' | 'isSaving' | 'saved' | 'onPick'> & {
  accounts: BunqAccount[]
}

function AccountPicker({ accounts, selectedAccountId, isSaving, saved, onPick }: AccountPickerProps) {
  const groupName = useId()
  const [choice, setChoice] = useState(selectedAccountId)
  const savedRef = useRef<HTMLParagraphElement>(null)

  // The radios and the button are disabled while saving, which drops focus to the page. The announcement
  // is where it lands, so a keyboard user hears what was saved and keeps their place.
  useEffect(() => {
    if (saved) savedRef.current?.focus()
  }, [saved])

  const picked = accounts.find((account) => account.id === selectedAccountId)

  if (accounts.length === 0) {
    return <p className="text-small text-muted-foreground">This bunq login has no accounts to show.</p>
  }

  return (
    <fieldset className="flex flex-col gap-1" disabled={isSaving}>
      <legend className="text-small font-semibold">Choose the account the Money page shows</legend>
      {accounts.map((account) => (
        <label key={account.id} className="flex min-h-11 items-center gap-3 py-2 text-small">
          <input
            type="radio"
            name={groupName}
            value={account.id}
            checked={choice === account.id}
            onChange={() => setChoice(account.id)}
            className={RADIO_CLASS}
          />
          {account.name}
        </label>
      ))}
      <div className="mt-2">
        <Button
          size="sm"
          disabled={isSaving || choice === undefined || choice === selectedAccountId}
          onClick={() => choice && onPick(choice)}
        >
          {isSaving ? 'Saving…' : 'Use this account'}
        </Button>
      </div>
      {/* Mounted before it has text, so the announcement is read when it appears. */}
      <p ref={savedRef} role="status" tabIndex={-1} className="mt-3 text-small outline-none empty:sr-only">
        {saved && picked ? `The Money page now shows ${picked.name}.` : ''}
      </p>
    </fieldset>
  )
}
