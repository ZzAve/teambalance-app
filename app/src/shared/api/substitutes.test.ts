import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import type { SubstituteEntry } from './generated/model/SubstituteEntry'
import { applyOptimisticSubstitute } from './substitute-cache'
import { patchCachedEvents, rollBack } from './substitutes'

const femke: SubstituteEntry = {
  substituteId: 'sub-1',
  name: 'Femke',
  position: undefined,
  state: 'MAYBE',
  changedBy: 'user-0',
  updatedAt: '2026-08-01T10:00:00Z',
}

// The keys and shapes the events reads cache under: `useEvents` keeps the raw `{ events }` response
// (its `select` unwraps on read), `useEvent` keeps the bare detail. The list one was missed before.
const LIST_KEY = ['events', { includePast: false }]
const DETAIL_KEY = ['events', 'evt-1']

const seeded = () => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(LIST_KEY, { events: [{ id: 'evt-1', substitutes: [femke] }] })
  queryClient.setQueryData(DETAIL_KEY, { id: 'evt-1', substitutes: [femke] })
  return queryClient
}

const setAttending = (queryClient: QueryClient) =>
  patchCachedEvents(queryClient, (cached) =>
    applyOptimisticSubstitute(cached, 'evt-1', 'sub-1', 'ATTENDING', 'user-9', undefined),
  )

describe('patchCachedEvents', () => {
  it('patches the list and the detail cache at once, so the list lineup shows the tap before the server answers', async () => {
    const queryClient = seeded()
    await setAttending(queryClient)

    const list = queryClient.getQueryData<{ events: { substitutes: SubstituteEntry[] }[] }>(LIST_KEY)
    const detail = queryClient.getQueryData<{ substitutes: SubstituteEntry[] }>(DETAIL_KEY)
    expect(list?.events[0].substitutes[0].state).toBe('ATTENDING')
    expect(detail?.substitutes[0].state).toBe('ATTENDING')
  })

  it('rolls both caches back to their snapshots when the write fails', async () => {
    const queryClient = seeded()
    const context = await setAttending(queryClient)
    rollBack(queryClient, context)

    expect(queryClient.getQueryData(LIST_KEY)).toEqual({ events: [{ id: 'evt-1', substitutes: [femke] }] })
    expect(queryClient.getQueryData(DETAIL_KEY)).toEqual({ id: 'evt-1', substitutes: [femke] })
  })
})
