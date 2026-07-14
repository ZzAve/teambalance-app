import { QueryClient } from '@tanstack/react-query'

// One shared client so the router's auth guard (root beforeLoad) and the React tree read and
// write the same cache — the guard's session probe hydrates the very query useAuthMe subscribes to.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})
