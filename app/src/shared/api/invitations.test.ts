import { MutationObserver } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { acceptInvitationMutationOptions } from './invitations'
import { queryClient } from './query-client'
import { api } from './wirespec-client'

vi.mock('./wirespec-client', () => ({ api: { acceptInvitation: vi.fn() } }))

afterEach(() => {
  queryClient.clear()
  vi.mocked(api.acceptInvitation).mockReset()
})

it('resets the cache after an invitation is accepted', async () => {
  queryClient.setQueryData(['events'], [{ id: 'e1' }])
  vi.mocked(api.acceptInvitation).mockResolvedValue({ status: 200, body: { slug: 'second' } } as never)

  await new MutationObserver(queryClient, acceptInvitationMutationOptions).mutate('token')

  expect(queryClient.getQueryData(['events'])).toBeUndefined()
})
