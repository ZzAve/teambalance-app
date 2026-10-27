import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { BunqConnectUnavailableError, startBunqConnection, useBunqConnection } from '@shared/api/bunq-connection'
import type { ConnectBunqResult } from '../lib/bunq-result'
import { ConnectBunqView } from './ConnectBunqView'

/**
 * Container for connecting Bunq: reads the connection status and, on Connect, leaves the app for the
 * Bunq approval page. Renders nothing until the status says connecting is available, so a deployment
 * with it switched off shows no trace of it. Pure wiring, covered by the prop-only View's stories
 * (ADR-0017). Admin-gating is enforced on the route (beforeLoad) and again on the backend (403).
 */
export function ConnectBunq({ result }: { result?: ConnectBunqResult }) {
  const { data: status } = useBunqConnection()
  const connect = useMutation({ mutationFn: startBunqConnection })
  const section = useRef<HTMLDivElement>(null)
  const available = status?.connectAvailable === true

  // Bunq sends the Admin back to the top of a long settings page: bring the section into view. The View
  // takes focus to the result once it is there.
  useEffect(() => {
    if (result && available) section.current?.scrollIntoView({ block: 'start' })
  }, [result, available])

  if (!status?.connectAvailable) return null

  return (
    <div ref={section} className="scroll-mt-[var(--header-height)]">
      <ConnectBunqView
        connected={status.connected}
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
