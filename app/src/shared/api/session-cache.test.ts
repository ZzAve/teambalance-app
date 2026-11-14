import { QueryObserver } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authMeQueryOptions } from './auth'
import { queryClient } from './query-client'
import { resetCacheForNewTenant } from './session-cache'
import { activateTeam } from './teams'
import { api } from './wirespec-client'

vi.mock('./wirespec-client', () => ({ api: { activateTeam: vi.fn() } }))

const TEAM = { id: 't2', slug: 'second', name: 'Second' }

describe('resetCacheForNewTenant', () => {
  afterEach(() => queryClient.clear())

  it('drops every cached query, tenant-scoped and session alike', async () => {
    queryClient.setQueryData(['events'], [{ id: 'e1' }])
    queryClient.setQueryData(authMeQueryOptions.queryKey, null)

    await resetCacheForNewTenant()

    expect(queryClient.getQueryData(['events'])).toBeUndefined()
    expect(queryClient.getQueryData(authMeQueryOptions.queryKey)).toBeUndefined()
  })

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
})

describe('activateTeam', () => {
  afterEach(() => {
    queryClient.clear()
    vi.mocked(api.activateTeam).mockReset()
  })

  it('resets the cache once the switch is authorized', async () => {
    queryClient.setQueryData(['events'], [{ id: 'e1' }])
    vi.mocked(api.activateTeam).mockResolvedValue({ status: 200, body: TEAM } as never)

    expect(await activateTeam('second')).toEqual(TEAM)

    expect(queryClient.getQueryData(['events'])).toBeUndefined()
  })

  it('leaves the cache alone when the switch is refused', async () => {
    queryClient.setQueryData(['events'], [{ id: 'e1' }])
    vi.mocked(api.activateTeam).mockResolvedValue({ status: 404, body: undefined } as never)

    expect(await activateTeam('unknown')).toBeNull()

    expect(queryClient.getQueryData(['events'])).toEqual([{ id: 'e1' }])
  })
})
