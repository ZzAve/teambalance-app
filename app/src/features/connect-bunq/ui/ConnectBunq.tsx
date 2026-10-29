import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  BunqConnectUnavailableError,
  isBunqGrantRejected,
  startBunqConnection,
  useBunqAccounts,
  useBunqConnection,
} from '@shared/api/bunq-connection'
import type { ConnectBunqResult } from '../lib/bunq-result'
import { BunqAccounts } from './BunqAccounts'
import { ConnectBunqView } from './ConnectBunqView'

/**
 * Container for connecting Bunq: reads the connection status and, on Connect, leaves the app for the
 * Bunq approval page. A connected team gets the account picker and Disconnect in the View's accounts
 * slot. Renders nothing until the status says connecting is available, so a deployment with it switched
 * off shows no trace of it. Pure wiring, covered by the prop-only View's stories (ADR-0017).
 * Admin-gating is enforced on the route (beforeLoad) and again on the backend (403).
 */
export function ConnectBunq({ result }: { result?: ConnectBunqResult }) {
  const { data: status } = useBunqConnection()
  // The picker below reads the accounts; this only watches that read for a rejected grant.
  const rejected = isBunqGrantRejected(useBunqAccounts(false).error)
  const connect = useMutation({ mutationFn: startBunqConnection })
  // Disconnecting removes the accounts section it was started from, so the signal that it happened lives here.
  const [disconnected, setDisconnected] = useState(false)
  const section = useRef<HTMLDivElement>(null)
  const available = status?.connectAvailable === true

  // Bunq sends the Admin back to the top of a long settings page: bring the section into view. The View
  // takes focus to the result once it is there.
  useEffect(() => {
    if (result && available) section.current?.scrollIntoView({ block: 'start' })
  }, [result, available])

  // Coming back to this page from Bunq with the browser's back button can restore it from the
  // back/forward cache with the finished request still in state, which would keep "Opening Bunq…" up.
  const { reset } = connect
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset()
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [reset])

  if (!status?.connectAvailable) return null

  return (
    <div ref={section} className="scroll-mt-[var(--header-height)]">
      <ConnectBunqView
        connected={status.connected}
        accountPicked={status.accountPicked}
        rejected={rejected}
        disconnected={disconnected}
        accounts={<BunqAccounts onDisconnected={() => setDisconnected(true)} />}
        result={result}
        focusResult
        // Stays pending after the response too: the browser is on its way to Bunq, and a second click must not start another state.
        isConnecting={connect.isPending || connect.isSuccess}
        error={connect.error && errorMessage(connect.error)}
        // The navigation is a mutate callback, as in the top-up: a response that arrives after the
        // component went away must not navigate.
        onConnect={() => connect.mutate(undefined, { onSuccess: (url) => window.location.assign(url) })}
      />
    </div>
  )
}

function errorMessage(error: Error) {
  return error instanceof BunqConnectUnavailableError
    ? "Connecting Bunq isn’t available right now."
    : "Couldn’t open Bunq. Please try again."
}
