import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Button } from '@shared/ui/button'
import type { ConnectBunqResult } from '../lib/bunq-result'

interface ConnectBunqViewProps {
  /** The team already has a Bunq connection; connecting again replaces it. */
  connected: boolean
  /** The Admin picked the account the Money page reads. Only meaningful while connected. */
  accountPicked?: boolean
  /** The Admin just disconnected: the status says so and takes focus, since the controls they used are gone. */
  disconnected?: boolean
  /** The account picker and Disconnect, supplied by the ConnectBunq container so this View stays prop-only. Shown while connected. */
  accounts?: ReactNode
  result?: ConnectBunqResult
  /** Move focus to the result on mount: the page was opened by Bunq's return, at the top of a long page. */
  focusResult?: boolean
  /** The start request is in flight, or the browser is on its way to Bunq. */
  isConnecting?: boolean
  /** The start request failed, shown inline. */
  error?: string | null
  onConnect: () => void
}

const DECLINED_TEXT = 'You declined at Bunq, so nothing was connected.'
const DISCONNECTED_TEXT = 'Disconnected from bunq.'
const FAILED_TEXT = 'Couldn’t connect Bunq. Please try again.'

// Error texts sit on a card; red-ink clears 4.5:1 there in both themes.
const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'

/**
 * Presentational "connect Bunq" section for the team settings: what connecting grants, a tick to
 * acknowledge it, and the Connect button that stays disabled until it is ticked. Owns only the tick and
 * whether a connected team has opened the form to connect another login. A connected team sees its
 * status and the account picker instead, with the form behind a text button.
 * A declined trip is the Admin's choice and reads as plain status; only a failure is an alert. The
 * status line is mounted before it has anything to say; when the page was opened by Bunq's return the
 * result also takes focus, so a screen reader reads it even though it arrived with the page.
 */
export function ConnectBunqView({
  connected,
  accountPicked,
  disconnected,
  accounts,
  result: tripResult,
  focusResult,
  isConnecting,
  error,
  onConnect,
}: ConnectBunqViewProps) {
  // A result still in the URL from an earlier trip says nothing about what the Admin has just done.
  const result = disconnected ? undefined : tripResult
  const hintId = useId()
  const formId = useId()
  const [acknowledged, setAcknowledged] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const resultRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (focusResult && result) resultRef.current?.focus({ preventScroll: true })
  }, [focusResult, result])

  // Disconnect removes the button the Admin pressed, so focus would fall to the page. It goes to the status
  // line once the connection reads as gone, which is a moment after the request succeeded.
  useEffect(() => {
    if (disconnected && !connected) resultRef.current?.focus()
  }, [disconnected, connected])

  const failed = result === 'error'
  const statusText = failed ? '' : statusOf(result, connected, accountPicked, disconnected)
  const showForm = !connected || reconnecting || !!isConnecting
  // While the browser is on its way to Bunq the acknowledgement stays ticked and disabled, as does the button.
  const ticked = acknowledged || !!isConnecting

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">Connect Bunq</h2>
        {!connected && (
          <p className="mt-1 text-small text-muted-foreground">
            Show the balance and payments of the team’s Bunq account on the Money page.
          </p>
        )}
      </div>

      {/* Right under the heading: the page opens here after Bunq, and the result is the first thing to read. */}
      <p
        ref={failed ? undefined : resultRef}
        role="status"
        tabIndex={-1}
        className="text-small font-semibold outline-none empty:sr-only"
      >
        {statusText}
      </p>
      {failed && (
        <p ref={resultRef} role="alert" tabIndex={-1} className={`${ERROR_CLASS} outline-none`}>
          {FAILED_TEXT}
        </p>
      )}

      {connected && accounts}
      {connected && (
        <Button
          variant="link"
          size="sm"
          className="self-start px-0 underline"
          aria-expanded={showForm}
          aria-controls={showForm ? formId : undefined}
          disabled={isConnecting}
          onClick={() => {
            // Closing the form takes the consent back: it is asked for again when the form is reopened.
            if (reconnecting) setAcknowledged(false)
            setReconnecting(!reconnecting)
          }}
        >
          Connect a different bunq login
        </Button>
      )}

      {showForm && (
        <div id={formId} className="flex flex-col gap-4">
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
              Connecting gives TeamBalance bunq’s standard app access to this bunq login, which is more than
              reading: bunq’s default grant also allows creating payments and draft payments. TeamBalance only
              reads the balance and payments of the one account you pick and stores no payment data. Every member
              of this team will see the balance and the names, dates and amounts of payments on that account. You
              can disconnect in TeamBalance at any time, which deletes the access it stored; to withdraw the grant
              at bunq itself, remove TeamBalance under connected apps in the bunq app.
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
      )}
    </div>
  )
}

function statusOf(result: ConnectBunqResult | undefined, connected: boolean, accountPicked?: boolean, disconnected?: boolean) {
  if (result === 'declined') return DECLINED_TEXT
  if (connected) return accountPicked ? 'Connected to bunq.' : 'Connected, pick an account below.'
  return disconnected ? DISCONNECTED_TEXT : ''
}
