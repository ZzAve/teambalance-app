import { useSubstitutes } from '@shared/api/substitutes'
import { SubstituteRosterView } from './SubstituteRosterView'

/**
 * Container for the Team page's Substitutes: wires the substitutes query to SubstituteRosterView.
 * Pure wiring — the View's stories cover its states (ADR-0017). Editing lives on each Substitute's page.
 */
export function SubstituteRoster() {
  const { data: substitutes, isLoading, error } = useSubstitutes()
  return <SubstituteRosterView substitutes={substitutes} isLoading={isLoading} isError={!!error} />
}
