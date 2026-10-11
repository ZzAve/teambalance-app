import { useMoneyPoolSettings, useSetMoneyPoolSettings } from '@shared/api/money-pool'
import { MoneySettingsView } from './MoneySettingsView'

/**
 * Container for the money pool settings: wires the settings query and the save mutation to the
 * presentational MoneySettingsView. Pure wiring, covered by e2e (ADR-0017). Admin-gating is enforced
 * on the route (beforeLoad) and again on the backend (403), so this component assumes an admin.
 */
export function MoneySettings() {
  const { data: settings, isLoading, error } = useMoneyPoolSettings()
  const save = useSetMoneyPoolSettings()

  return (
    <MoneySettingsView
      settings={settings}
      isLoading={isLoading}
      isError={!!error}
      isSaving={save.isPending}
      error={save.error ? 'Could not save the money pool settings. Please try again.' : null}
      onSave={(next) => save.mutate(next)}
    />
  )
}
