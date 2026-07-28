import { QueryClient } from '@tanstack/react-query'
import { shouldRetryWake, wakeRetryDelayMs } from './retry-policy'

// One shared client so the router's auth guard (root beforeLoad) and the React tree read and
// write the same cache — the guard's session probe hydrates the very query useAuthMe subscribes to.
// The same retry policy therefore also governs the imperative beforeLoad probe (it runs through
// ensureQueryData on this client): a still-waking backend's transient failures are retried with
// backoff, while real 4xx errors fail fast so the guard's fail-closed redirect stays instant.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => shouldRetryWake(failureCount, error),
      retryDelay: (attemptIndex) => wakeRetryDelayMs(attemptIndex),
    },
  },
})
