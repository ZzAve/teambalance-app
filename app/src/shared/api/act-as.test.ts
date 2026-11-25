import { MutationObserver } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { enterActAsMutationOptions } from './act-as'
import { queryClient } from './query-client'
import { api } from './wirespec-client'

vi.mock('./wirespec-client', () => ({ api: { enterActAs: vi.fn() } }))

afterEach(() => {
  queryClient.clear()
  vi.mocked(api.enterActAs).mockReset()
})

it('resets the cache after entering a team', async () => {
  queryClient.setQueryData(['events'], [{ id: 'e1' }])
  vi.mocked(api.enterActAs).mockResolvedValue({ status: 200, body: { id: 't2' } } as never)

  await new MutationObserver(queryClient, enterActAsMutationOptions).mutate('t2')

  expect(queryClient.getQueryData(['events'])).toBeUndefined()
})
