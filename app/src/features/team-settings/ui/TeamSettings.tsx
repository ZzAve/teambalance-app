import { useSeason, useSetSeason } from '@shared/api/season'
import { TeamSettingsView } from './TeamSettingsView'

/**
 * Container for team settings: wires the season query and the SetSeason mutation to the
 * presentational TeamSettingsView. Pure wiring — the load/error/data shells live in the View
 * (props-driven), so this seam is covered by e2e, not a story. Admin-gating is enforced on the route
 * (beforeLoad) and again on the backend (403), so this component assumes an admin. See ADR-0017.
 */
export function TeamSettings() {
  const { data: season, isLoading, error } = useSeason()
  const setSeason = useSetSeason()

  return (
    <TeamSettingsView
      season={season ? { start: season.start, end: season.end } : undefined}
      isLoading={isLoading}
      isError={!!error}
      isSaving={setSeason.isPending}
      error={setSeason.error ? 'Could not save the season. Please try again.' : null}
      onSave={(bounds) => setSeason.mutate(bounds)}
    />
  )
}
