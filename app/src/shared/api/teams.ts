import { useMutation } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { TeamRef } from './generated/model/TeamRef'

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

/**
 * Maps a failed create-team response to a typed [CreateTeamError]. Pure and exported so it can be
 * unit-tested against the backend's contract (#158): 403 → invalid code; 409 → already-in-team (banner)
 * vs slug-taken (inline); 400 → invalid name/slug (inline); anything else → a generic, retry-safe
 * banner. The backend's 409 slug code is TEAM_SLUG_TAKEN; everything else on a 409 is a slug clash.
 */
export function toCreateTeamError(status: number, code: string | undefined): CreateTeamError {
  if (status === 403) {
    return new CreateTeamError('INVALID_CREATION_CODE', "That creation code isn't valid.")
  }
  if (status === 409) {
    return new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')
  }
  if (status === 400) {
    if (code === 'INVALID_NAME') return new CreateTeamError('INVALID_NAME', 'Enter a team name.')
    if (code === 'INVALID_SLUG') {
      return new CreateTeamError('INVALID_SLUG', 'Use lowercase letters, numbers, and hyphens.')
    }
  }
  return new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')
}

export interface CreateTeamInput {
  name: string
  slug: string
  creationCode: string
}

// The success side-effects (localStorage teamId, invalidating ['auth','me'], navigation) live in the
// route container per #158 — this hook only performs the request and normalises failures.
export function useCreateTeam() {
  return useMutation({
    mutationFn: async ({ name, slug, creationCode }: CreateTeamInput) => {
      const res = await api.CreateTeam({ body: { name, slug, creationCode } }).catch(() => {
        // A fetch/network failure never reaches a status — surface it as a retry-safe banner.
        throw new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')
      })
      if (res.status === 201) return res.body
      const code = (res.body as { code?: string } | undefined)?.code
      throw toCreateTeamError(res.status, code)
    },
  })
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
      const res = await api.CreateMemberlessTeam({ body: { name, slug } }).catch(() => {
        throw new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.')
      })
      if (res.status === 201) return res.body
      if (res.status === 403) {
        throw new CreateTeamError('GENERIC', "You don't have access to create teams.")
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
  const res = await api.ActivateTeam({ slug })
  return res.status === 200 ? res.body : null
}
