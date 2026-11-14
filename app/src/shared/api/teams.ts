import { useMutation } from '@tanstack/react-query'
import { api } from './wirespec-client'
import { resetCacheForNewTenant } from './session-cache'
import type { TeamRef } from './generated/model/TeamRef'
import { i18n } from '@shared/i18n/i18n'

// Re-export the generated contract types so the app has a single source of truth.
export type { Team } from './generated/model/Team'
export type { TeamRef } from './generated/model/TeamRef'

// Create-team can fail in ways the form must place differently: some inline on a specific field
// (recoverable), some as a screen banner. The stable frontend code drives that placement + copy; it is
// mapped from the backend's (status, discriminator) by toCreateTeamError so the mapping is unit-tested.
export type CreateTeamErrorCode =
  | 'INVALID_CREATION_CODE'
  | 'SLUG_TAKEN'
  | 'INVALID_SLUG'
  | 'INVALID_NAME'
  | 'GENERIC'

export class CreateTeamError extends Error {
  constructor(
    public readonly code: CreateTeamErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'CreateTeamError'
  }
}

/** The error's message when its code is one of [codes], else null — how forms place a failure by field or banner. */
export function placeCreateTeamError(error: CreateTeamError | null | undefined, ...codes: CreateTeamErrorCode[]): string | null {
  return error && codes.includes(error.code) ? error.message : null
}

/**
 * Maps a failed create-team response to a typed [CreateTeamError]. Pure and exported so it can be
 * unit-tested against the backend's contract (#158): 403 → invalid code; 409 → already-in-team (banner)
 * vs slug-taken (inline); 400 → invalid name/slug (inline); anything else → a generic, retry-safe
 * banner. The backend's 409 slug code is TEAM_SLUG_TAKEN; everything else on a 409 is a slug clash.
 */
export function toCreateTeamError(status: number, code: string | undefined): CreateTeamError {
  if (status === 403) {
    return new CreateTeamError('INVALID_CREATION_CODE', i18n.t('errors.createTeam.invalidCode'))
  }
  if (status === 409) {
    return new CreateTeamError('SLUG_TAKEN', i18n.t('errors.createTeam.slugTaken'))
  }
  if (status === 400) {
    if (code === 'INVALID_NAME') return new CreateTeamError('INVALID_NAME', i18n.t('errors.createTeam.nameRequired'))
    if (code === 'INVALID_SLUG') {
      return new CreateTeamError('INVALID_SLUG', i18n.t('createTeam.slug.format'))
    }
  }
  return new CreateTeamError('GENERIC', i18n.t('errors.createTeam.generic'))
}

export interface CreateTeamInput {
  name: string
  slug: string
  creationCode: string
}

// The server makes the new Team Active (ADR-0023 §4), so success resets the cache here; navigation
// stays in the route container per #158. This hook otherwise only performs the request and normalises failures.
export const createTeamMutationOptions = {
  onSuccess: resetCacheForNewTenant,
  mutationFn: async ({ name, slug, creationCode }: CreateTeamInput) => {
    // The page's language, for the team-created email when the founder has stored none (ADR-0043 §4).
    const language = i18n.language === 'nl' ? 'NL' : 'EN'
    const res = await api.createTeam({ body: { name, slug, creationCode, language } }).catch(() => {
      // A fetch/network failure never reaches a status — surface it as a retry-safe banner.
      throw new CreateTeamError('GENERIC', i18n.t('errors.createTeam.generic'))
    })
    if (res.status === 201) return res.body
    const code = (res.body as { code?: string } | undefined)?.code
    throw toCreateTeamError(res.status, code)
  },
}

export function useCreateTeam() {
  return useMutation(createTeamMutationOptions)
}

export interface CreateMemberlessTeamInput {
  name: string
  slug: string
}

/**
 * Memberless creation by a Platform Admin (ADR-0024 §5): POST /api/admin/teams. No creation code — the
 * platform-admin allowlist on `/admin` is the gate. Reuses [toCreateTeamError] for the shared
 * name/slug failures; a 403 here means "not a Platform Admin" rather than a bad code, but the console
 * is already admin-gated so it lands as a generic banner. Success returns the new (empty) team; the
 * caller does not become a member — they enter it via act-as.
 */
export function useCreateMemberlessTeam() {
  return useMutation({
    mutationFn: async ({ name, slug }: CreateMemberlessTeamInput) => {
      const res = await api.createMemberlessTeam({ body: { name, slug } }).catch(() => {
        throw new CreateTeamError('GENERIC', i18n.t('errors.createTeam.genericMemberless'))
      })
      if (res.status === 201) return res.body
      if (res.status === 403) {
        throw new CreateTeamError('GENERIC', i18n.t('errors.createTeam.noAccess'))
      }
      const code = (res.body as { code?: string } | undefined)?.code
      throw toCreateTeamError(res.status, code)
    },
  })
}

/**
 * The authorized switch (ADR-0023 §2). Null for an unknown slug *and* for one that is not the
 * caller's — the backend answers both with the same bare 404, and this preserves that.
 */
export async function activateTeam(slug: string): Promise<TeamRef | null> {
  const res = await api.activateTeam({ slug })
  if (res.status !== 200) return null
  await resetCacheForNewTenant()
  return res.body
}
