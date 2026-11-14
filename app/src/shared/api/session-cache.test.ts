import { QueryObserver } from '@tanstack/react-query'
import { afterEach, expect, it } from 'vitest'
import { queryClient } from './query-client'
import { resetCacheForNewTenant } from './session-cache'

afterEach(() => queryClient.clear())

it('refetches a query that is still observed', async () => {
  let tenant = 'old'
  const observer = new QueryObserver(queryClient, { queryKey: ['events'], queryFn: async () => tenant })
  const unsubscribe = observer.subscribe(() => undefined)
  await queryClient.refetchQueries({ queryKey: ['events'] })
  expect(queryClient.getQueryData(['events'])).toBe('old')

  tenant = 'new'
  await resetCacheForNewTenant()

  expect(queryClient.getQueryData(['events'])).toBe('new')
  unsubscribe()
})
