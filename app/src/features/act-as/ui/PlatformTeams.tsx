import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ActAsError, usePlatformTeams, useEnterActAs, type TeamRef } from '@shared/api/act-as'
import { consumeActAsExpiredFlag } from '@shared/api/act-as-redirect'
import { teamRoutes } from '@shared/lib/team-routes'
import { PlatformTeamsView } from './PlatformTeamsView'

/**
 * Container for the platform console: wires the team list and the enter mutation to the View, and
 * picks up the "your act-as ran out" flag the API client left behind on its way here. Pure wiring,
 * covered by e2e rather than a story (ADR-0017).
 */
export function PlatformTeams() {
  const navigate = useNavigate()
  const { data: teams, isLoading, error } = usePlatformTeams()
  const enterActAs = useEnterActAs()
  // Read once on arrival and cleared, so a later visit doesn't re-explain a lapse that is long over.
  const [wasExpired] = useState(consumeActAsExpiredFlag)

  const isForbidden = error instanceof ActAsError && error.code === 'FORBIDDEN'

  return (
    <PlatformTeamsView
      teams={teams}
      isLoading={isLoading}
      isError={!!error && !isForbidden}
      isForbidden={isForbidden}
      isEntering={enterActAs.isPending}
      wasExpired={wasExpired}
      onEnter={(team: TeamRef) =>
        enterActAs.mutate(team.id, { onSuccess: () => navigate({ to: teamRoutes(team.slug).events }) })
      }
    />
  )
}
