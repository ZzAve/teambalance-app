import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { toCreateTeamError } from './teams'

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

describe('toCreateTeamError in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('carries a Dutch message', async () => {
    await i18n.changeLanguage('nl')
    expect(toCreateTeamError(403, undefined).message).toBe('Die aanmaakcode is niet geldig.')
    expect(toCreateTeamError(409, undefined).message).toBe('Dat adres is al bezet — probeer een ander.')
    expect(toCreateTeamError(500, undefined).message).toBe('Je team aanmaken is mislukt. Probeer het opnieuw.')
  })
})
