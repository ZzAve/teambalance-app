import { api } from './wirespec-client'
import type { TeamRef } from './generated/model/TeamRef'

export type { Team } from './generated/model/Team'
export type { TeamRef } from './generated/model/TeamRef'

/**
 * The authorized switch (ADR-0023 §2). Null for an unknown slug *and* for one that is not the
 * caller's — the backend answers both with the same bare 404, and this preserves that.
 */
export async function activateTeam(slug: string): Promise<TeamRef | null> {
  const res = await api.ActivateTeam({ slug })
  return res.status === 200 ? res.body : null
}
