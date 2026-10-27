import { useState } from 'react'
import { Button } from '@shared/ui/button'

/** How the last trip to Bunq ended, as the API's callback reports it in `?bunq=`. */
export type ConnectBunqResult = 'connected' | 'declined' | 'error'

interface ConnectBunqViewProps {
  /** The team already has a Bunq connection; connecting again replaces it. */
  connected: boolean
  result?: ConnectBunqResult
  /** The start request is in flight, or the browser is on its way to Bunq. */
  isConnecting?: boolean
  /** The start request failed, shown inline. */
  error?: string | null
  onConnect: () => void
}

const RESULT_TEXT: Record<ConnectBunqResult, string> = {
  connected: 'Bunq connected',
  declined: 'You declined at Bunq, so nothing was connected.',
  error: "Couldn't connect Bunq. Please try again.",
}

// Error texts sit on a card; red-ink clears 4.5:1 there in both themes.
const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'

/**
 * Presentational "connect Bunq" section for the team settings: what connecting grants, a tick to
 * acknowledge it, and the Connect button that stays disabled until it is ticked. Owns only the tick.
 * The status line is a live region that is always mounted, so the result is announced when it appears
 * (a region added together with its text is not).
 */
export function ConnectBunqView({ connected, result, isConnecting, error, onConnect }: ConnectBunqViewProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const failed = result === 'declined' || result === 'error'

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">Connect Bunq</h2>
        <p className="mt-1 text-small text-muted-foreground">
          {connected
            ? "The team's Bunq account is connected. Connecting again replaces the current connection."
            : "Show the balance and payments of the team's Bunq account on the Money page."}
        </p>
      </div>

      {/* Right under the heading: the page opens here after Bunq, and the result is the first thing to read. */}
      <p
        role="status"
        className={failed ? `${ERROR_CLASS} empty:sr-only` : 'text-small font-semibold empty:sr-only'}
      >
        {result ? RESULT_TEXT[result] : ''}
      </p>

      {/* The whole row is the label, so the tick and the text are one 44px-high target. */}
      <label className="flex min-h-11 items-start gap-3 py-2 text-small leading-relaxed">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <span>
          Connecting gives TeamBalance bunq&apos;s standard app access to this bunq login, which is more than reading:
          bunq&apos;s default grant also allows creating payments and draft payments. TeamBalance only reads the
          balance and payments of the one account you pick and stores no payment data. Every member of this team will
          see the balance and the names, dates and amounts of payments on that account. You can revoke this in the
          bunq app under connected apps; a Disconnect button in TeamBalance follows.
        </span>
      </label>

      {error && (
        <p role="alert" className={ERROR_CLASS}>
          {error}
        </p>
      )}

      <Button className="self-start" disabled={!acknowledged || isConnecting} onClick={onConnect}>
        {isConnecting ? 'Opening Bunq…' : connected ? 'Connect again' : 'Connect Bunq'}
      </Button>
    </div>
  )
}
