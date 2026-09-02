import { useState } from 'react'
import type { Position } from '@shared/api/positions'
import {
  PositionError,
  useCreatePosition,
  useDeletePosition,
  usePositionUsage,
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
  // The delete dialog's target, lifted here only so its usage can be fetched — the dialog itself
  // stays the View's own local state.
  const [usageTarget, setUsageTarget] = useState<Position | null>(null)
  const { data: usage } = usePositionUsage(usageTarget?.id ?? null)

  const activeError = [createPosition.error, renamePosition.error, deletePosition.error].find(
    (e): e is PositionError => e instanceof PositionError,
  )

  const isSaving = createPosition.isPending || renamePosition.isPending || deletePosition.isPending

  return (
    <ManagePositionsView
      positions={positions}
      usage={usageTarget ? usage : undefined}
      onConfirmTargetChange={setUsageTarget}
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
