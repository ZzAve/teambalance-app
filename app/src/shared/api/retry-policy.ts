// Cold-start retry policy. The prod backend scales to zero; the platform normally *queues* the
// first request and returns a slow 200 (patience, handled by the splash — no retry needed). But a
// scale-up race or a Serverless-SQL cold-resume can still surface a *transient* failure: a network
// reject (fetch throws before any response) or a gateway 502/503/504. Those we retry with backoff;
// everything else (a real 4xx — auth, not-found, validation) must fail fast so the route guard's
// fail-closed redirect and inline error states still work.
//
// Kept pure (no QueryClient, no timers) so it is unit-testable; wired into the shared query client
// in query-client.ts, which also governs the beforeLoad session probe (ensureQueryData runs through
// the same client).

const TRANSIENT_STATUSES = new Set([502, 503, 504])

/** Attempts *after* the first try — 1s, 2s, 4s → up to three retries before we give up. */
export const MAX_WAKE_RETRIES = 3

/** Read an HTTP status off a thrown error, if it carries one. A fetch reject carries none. */
function httpStatusOf(error: unknown): number | undefined {
  if (error !== null && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status
    return typeof status === 'number' ? status : undefined
  }
  return undefined
}

/**
 * Is this the kind of failure a still-waking backend produces? A missing status means the fetch
 * rejected at the network layer (connection refused / reset while the container spins up) — retry.
 * A carried status retries only for gateway errors; a 4xx is a real client error and fails fast.
 */
export function isTransientWakeError(error: unknown): boolean {
  const status = httpStatusOf(error)
  if (status === undefined) return true
  return TRANSIENT_STATUSES.has(status)
}

/** TanStack Query `retry` predicate: keep retrying transient wake failures up to the cap. */
export function shouldRetryWake(
  failureCount: number,
  error: unknown,
  maxRetries: number = MAX_WAKE_RETRIES,
): boolean {
  return failureCount < maxRetries && isTransientWakeError(error)
}

/** Exponential backoff (1s, 2s, 4s), capped so a genuinely-down backend doesn't stall a whole minute. */
export function wakeRetryDelayMs(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 8000)
}
