import {
  PositionError,
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useRenamePosition,
} from '@shared/api/positions'
import { ManagePositionsView } from './ManagePositionsView'

/**
 * Container for positions management: wires the positions query and the create/rename/delete
 * mutations to the presentational ManagePositionsView. Pure wiring — the load/error/data shells
 * live in the View (props-driven), so this seam is covered by e2e, not a story. The label-taken
 * discriminator (409) is passed down for inline display. See ADR-0017.
 */
export function ManagePositions() {
  const { data: positions, isLoading, error } = usePositions()
  const createPosition = useCreatePosition()
  const renamePosition = useRenamePosition()
  const deletePosition = useDeletePosition()

  const activeError = [createPosition.error, renamePosition.error, deletePosition.error].find(
    (e): e is PositionError => e instanceof PositionError,
  )

  const isSaving = createPosition.isPending || renamePosition.isPending || deletePosition.isPending

  return (
    <ManagePositionsView
      positions={positions}
      isLoading={isLoading}
      isError={!!error}
      isSaving={isSaving}
      errorCode={activeError?.code ?? null}
      onCreate={(label) => createPosition.mutate({ label })}
      onRename={(id, label) => renamePosition.mutate({ id, label })}
      onDelete={(position) => deletePosition.mutate({ id: position.id })}
    />
  )
}
