import { describe, expect, it } from 'vitest'
import { toCreateTeamError } from './teams'

describe('toCreateTeamError', () => {
  it('maps 403 to an invalid-creation-code error (field: code)', () => {
    const err = toCreateTeamError(403, 'INVALID_CREATION_CODE')
    expect(err.code).toBe('INVALID_CREATION_CODE')
  })

  it('maps 409 ALREADY_IN_TEAM to a banner error', () => {
    expect(toCreateTeamError(409, 'ALREADY_IN_TEAM').code).toBe('ALREADY_IN_TEAM')
  })

  it('maps any other 409 (backend TEAM_SLUG_TAKEN) to a slug-taken error', () => {
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
