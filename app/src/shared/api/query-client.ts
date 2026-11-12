import { QueryClient } from '@tanstack/react-query'
import { shouldRetryWake, wakeRetryDelayMs } from './retry-policy'

// One shared client so the router's auth guard (root beforeLoad) and the React tree read and
// write the same cache — the guard's session probe hydrates the very query useAuthMe subscribes to.
// The same retry policy therefore also governs the imperative beforeLoad probe (it runs through
// ensureQueryData on this client): a still-waking backend's transient failures are retried with
// backoff, while real 4xx errors fail fast so the guard's fail-closed redirect stays instant.
export const DEFAULT_STALE_TIME_MS = 30_000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      retry: (failureCount, error) => shouldRetryWake(failureCount, error),
      retryDelay: (attemptIndex) => wakeRetryDelayMs(attemptIndex),
    },
  },
})

// The session probe gates the first screen, so it alone waits out a cold boot: the gateway holds a
// request to a booting container for 10 s, then answers 504, and six retries start the last attempt
// ~91 s in. Other queries keep the shorter default so their error states still show promptly.
queryClient.setQueryDefaults(['auth', 'me'], {
  retry: (failureCount, error) => shouldRetryWake(failureCount, error, 6),
})
