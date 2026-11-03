/** How the last trip to Bunq ended, as the API's callback reports it in `?bunq=`. */
export type ConnectBunqResult = 'connected' | 'declined' | 'error'

const RESULTS: readonly string[] = ['connected', 'declined', 'error']

function isConnectBunqResult(value: unknown): value is ConnectBunqResult {
  return typeof value === 'string' && RESULTS.includes(value)
}

/** The `?bunq=` value as a result, or undefined for anything the callback does not send (garbage, repeats, absence). */
export function parseBunqResult(value: unknown): ConnectBunqResult | undefined {
  return isConnectBunqResult(value) ? value : undefined
}
