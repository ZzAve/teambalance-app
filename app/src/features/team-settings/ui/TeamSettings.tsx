import { useSeason, useSetSeason } from '@shared/api/season'
import { TeamSettingsView } from './TeamSettingsView'

/**
 * Container for team settings: wires the season query and the SetSeason mutation to the
 * presentational TeamSettingsView, and handles the loading/error shells. Admin-gating is enforced
 * on the route (beforeLoad) and again on the backend (403), so this component assumes an admin.
 */
export function TeamSettings() {
  const { data: season, isLoading, error } = useSeason()
  const setSeason = useSetSeason()

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (error || !season) return <p className="text-sm text-red-500">Couldn't load team settings. Please try again.</p>

  return (
    <TeamSettingsView
      season={{ start: season.start, end: season.end }}
      isSaving={setSeason.isPending}
      error={setSeason.error ? 'Could not save the season. Please try again.' : null}
      onSave={(bounds) => setSeason.mutate(bounds)}
    />
  )
}
