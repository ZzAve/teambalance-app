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
 * mutations to the presentational ManagePositionsView, and handles loading/error shells. The
 * label-taken discriminator (409) is passed down for inline display.
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
    <div>
      <h2 className="font-display text-2xl font-bold">Positions</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red-500">Couldn't load positions. Please try again.</p>}

      {positions && (
        <div className="mt-4">
          <ManagePositionsView
            positions={positions}
            isSaving={isSaving}
            errorCode={activeError?.code ?? null}
            onCreate={(label) => createPosition.mutate({ label })}
            onRename={(id, label) => renamePosition.mutate({ id, label })}
            onDelete={(position) => deletePosition.mutate({ id: position.id })}
          />
        </div>
      )}
    </div>
  )
}
