import { describe, expect, it } from 'vitest'
import { toCreateTeamError } from './teams'

describe('toCreateTeamError', () => {
  it('maps 403 to an invalid-creation-code error (field: code)', () => {
    const err = toCreateTeamError(403, 'INVALID_CREATION_CODE')
    expect(err.code).toBe('INVALID_CREATION_CODE')
  })

  // ADR-0019 §3's 409 ALREADY_IN_TEAM was lifted by ADR-0021 (#143), so a 409 now means one thing:
  // the slug is taken. A stale backend still sending the old code must not be read as a slug clash
  // *message* by accident — it still lands on the slug field, which is the closest honest placement,
  // and the code no longer exists for the form to branch on.
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
