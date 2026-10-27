import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@shared/ui/button'
import type { ConnectBunqResult } from '../lib/bunq-result'

interface ConnectBunqViewProps {
  /** The team already has a Bunq connection; connecting again replaces it. */
  connected: boolean
  result?: ConnectBunqResult
  /** Move focus to the result on mount: the page was opened by Bunq's return, at the top of a long page. */
  focusResult?: boolean
  /** The start request is in flight, or the browser is on its way to Bunq. */
  isConnecting?: boolean
  /** The start request failed, shown inline. */
  error?: string | null
  onConnect: () => void
}

const RESULT_TEXT: Record<ConnectBunqResult, string> = {
  connected: 'Bunq connected',
  declined: 'You declined at Bunq, so nothing was connected.',
  error: 'Couldn’t connect Bunq. Please try again.',
}

// Error texts sit on a card; red-ink clears 4.5:1 there in both themes.
const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'

/**
 * Presentational "connect Bunq" section for the team settings: what connecting grants, a tick to
 * acknowledge it, and the Connect button that stays disabled until it is ticked. Owns only the tick.
 * A declined trip is the Admin's choice and reads as plain status; only a failure is an alert. The
 * status line is mounted before it has anything to say; when the page was opened by Bunq's return the
 * result also takes focus, so a screen reader reads it even though it arrived with the page.
 */
export function ConnectBunqView({ connected, result, focusResult, isConnecting, error, onConnect }: ConnectBunqViewProps) {
  const hintId = useId()
  const [acknowledged, setAcknowledged] = useState(false)
  const resultRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (focusResult && result) resultRef.current?.focus({ preventScroll: true })
  }, [focusResult, result])

  const failed = result === 'error'
  // While the browser is on its way to Bunq the acknowledgement is given and frozen, as is the button.
  const ticked = acknowledged || !!isConnecting

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">Connect Bunq</h2>
        <p className="mt-1 text-small text-muted-foreground">
          {connected
            ? 'The team’s Bunq account is connected. Connecting again replaces the current connection.'
            : 'Show the balance and payments of the team’s Bunq account on the Money page.'}
        </p>
      </div>

      {/* Right under the heading: the page opens here after Bunq, and the result is the first thing to read. */}
      <p
        ref={failed ? undefined : resultRef}
        role="status"
        tabIndex={-1}
        className="text-small font-semibold outline-none empty:sr-only"
      >
        {result && !failed ? RESULT_TEXT[result] : ''}
      </p>
      {failed && (
        <p ref={resultRef} role="alert" tabIndex={-1} className={`${ERROR_CLASS} outline-none`}>
          {RESULT_TEXT.error}
        </p>
      )}

      {/* The whole row is the label, so the tick and the text are one 44px-high target. */}
      <label className="flex min-h-11 items-start gap-3 py-2 text-small leading-relaxed">
        <input
          type="checkbox"
          checked={ticked}
          disabled={isConnecting}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <span>
          Connecting gives TeamBalance bunq’s standard app access to this bunq login, which is more than reading:
          bunq’s default grant also allows creating payments and draft payments. TeamBalance only reads the
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

      <div className="flex flex-col items-start gap-2">
        <Button
          disabled={!acknowledged || isConnecting}
          aria-describedby={ticked ? undefined : hintId}
          onClick={onConnect}
        >
          {isConnecting ? 'Opening Bunq…' : connected ? 'Connect again' : 'Connect Bunq'}
        </Button>
        {!ticked && (
          <p id={hintId} className="text-caption text-muted-foreground">
            Tick the box above to continue.
          </p>
        )}
      </div>
    </div>
  )
}
