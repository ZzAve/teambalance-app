import { MutationObserver } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from './query-client'
import { activateTeam, createTeamMutationOptions, toCreateTeamError } from './teams'
import { api } from './wirespec-client'

vi.mock('./wirespec-client', () => ({ api: { activateTeam: vi.fn(), createTeam: vi.fn() } }))

const TEAM = { id: 't2', slug: 'second', name: 'Second' }

describe('toCreateTeamError', () => {
  it('maps 403 to an invalid-creation-code error (field: code)', () => {
    const err = toCreateTeamError(403, 'INVALID_CREATION_CODE')
    expect(err.code).toBe('INVALID_CREATION_CODE')
  })

  // ADR-0023 lifted ALREADY_IN_TEAM, so a 409 now means one thing: the slug is taken.
  it('maps every 409 to a slug-taken error, the only conflict create-team has left', () => {
    expect(toCreateTeamError(409, 'TEAM_SLUG_TAKEN').code).toBe('SLUG_TAKEN')
    expect(toCreateTeamError(409, undefined).code).toBe('SLUG_TAKEN')
  })

  it('maps 400 INVALID_NAME and INVALID_SLUG to their field errors', () => {
    expect(toCreateTeamError(400, 'INVALID_NAME').code).toBe('INVALID_NAME')
    expect(toCreateTeamError(400, 'INVALID_SLUG').code).toBe('INVALID_SLUG')
  })

  it('maps a codeless 400 and any 5xx to a generic, retry-safe banner', () => {
    expect(toCreateTeamError(400, undefined).code).toBe('GENERIC')
    expect(toCreateTeamError(500, undefined).code).toBe('GENERIC')
    expect(toCreateTeamError(503, undefined).code).toBe('GENERIC')
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

describe('createTeamMutationOptions', () => {
  afterEach(() => {
    queryClient.clear()
    vi.mocked(api.createTeam).mockReset()
  })

  it('resets the cache after a team is created', async () => {
    queryClient.setQueryData(['events'], [{ id: 'e1' }])
    vi.mocked(api.createTeam).mockResolvedValue({ status: 201, body: TEAM } as never)

    await new MutationObserver(queryClient, createTeamMutationOptions).mutate({
      name: 'Second',
      slug: 'second',
      creationCode: 'code',
    })

    expect(queryClient.getQueryData(['events'])).toBeUndefined()
  })
})
