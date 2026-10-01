import { useState } from 'react'
import { usePositions } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import {
  SubstituteError,
  useDeleteSubstitute,
  useSubstituteEventCount,
  useSubstitutes,
  useUpdateSubstitute,
} from '@shared/api/substitutes'
import { ManageSubstitutesView } from './ManageSubstitutesView'

interface ManageSubstitutesProps {
  /**
   * Whether this surface may edit the list. The route decides, as for MemberRoster: /team renders it
   * read-only for everyone (`false`, the default), /team/settings (admin-gated) renders it manageable.
   */
  canManage?: boolean
}

/**
 * Container for the Team's Substitute list: wires the substitutes query, the update and delete
 * mutations and the remove dialog's event count to ManageSubstitutesView. Pure wiring, covered by
 * e2e rather than a story. See ADR-0017.
 */
export function ManageSubstitutes({ canManage = false }: ManageSubstitutesProps) {
  const { data: substitutes, isLoading, error } = useSubstitutes()
  const { data: positions } = usePositions()
  const updateSubstitute = useUpdateSubstitute()
  const deleteSubstitute = useDeleteSubstitute()
  // The remove dialog's target, lifted here only so its event count can be fetched — the dialog
  // itself stays the View's own state.
  const [removeTarget, setRemoveTarget] = useState<Substitute | null>(null)
  const { data: eventCount } = useSubstituteEventCount(removeTarget?.id ?? null)

  const activeError = [updateSubstitute.error, deleteSubstitute.error].find(
    (e): e is SubstituteError => e instanceof SubstituteError,
  )

  const savingId = updateSubstitute.isPending
    ? updateSubstitute.variables?.id
    : deleteSubstitute.isPending
      ? deleteSubstitute.variables?.id
      : null

  return (
    <ManageSubstitutesView
      substitutes={substitutes}
      canManage={canManage}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      savingId={savingId}
      errorMessage={activeError?.message ?? null}
      eventCount={removeTarget ? eventCount : undefined}
      onConfirmTargetChange={setRemoveTarget}
      onRename={(substitute, name) =>
        updateSubstitute.mutate({ id: substitute.id, name, positionId: substitute.position?.id ?? null })
      }
      onChangePosition={(substitute, positionId) =>
        updateSubstitute.mutate({ id: substitute.id, name: substitute.name, positionId })
      }
      onRemove={(substitute) => deleteSubstitute.mutate({ id: substitute.id })}
    />
  )
}
