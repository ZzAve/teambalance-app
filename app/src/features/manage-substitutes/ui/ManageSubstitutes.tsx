import { usePositions } from '@shared/api/positions'
import { useSubstitutes, useUpdateSubstitute } from '@shared/api/substitutes'
import { ManageSubstitutesView } from './ManageSubstitutesView'

/**
 * Container for the Admin's Substitute list: wires the substitutes query and the update mutation
 * to ManageSubstitutesView. Pure wiring, covered by e2e rather than a story. See ADR-0017.
 */
export function ManageSubstitutes() {
  const { data: substitutes } = useSubstitutes()
  const { data: positions } = usePositions()
  const updateSubstitute = useUpdateSubstitute()

  return (
    <ManageSubstitutesView
      substitutes={substitutes}
      positions={positions ?? []}
      onRename={(substitute, name) =>
        updateSubstitute.mutate({ id: substitute.id, name, positionId: substitute.position?.id ?? null })
      }
    />
  )
}
