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

// The update saves the whole Substitute, so every edit starts from what they have now.
// `?? null`: the API sends null for "none" although the generated types say undefined.
const currentState = (substitute: Substitute) => ({
  id: substitute.id,
  name: substitute.name,
  positionId: substitute.position?.id ?? null,
  shirtNumber: substitute.shirtNumber ?? null,
})

/**
 * Container for the Team's Substitute list: wires the substitutes query, the update and delete
 * mutations and the remove dialog's event count to ManageSubstitutesView. Pure wiring; the View's
 * stories cover its states and callbacks. No e2e drives it: an Admin write inside the tenant, the
 * same kind of change as managing Positions, adds no seam the existing flows miss. See ADR-0017.
 */
export function ManageSubstitutes({ canManage = false }: ManageSubstitutesProps) {
  const { data: substitutes, isLoading, error } = useSubstitutes()
  const { data: positions } = usePositions()
  const updateSubstitute = useUpdateSubstitute()
  const deleteSubstitute = useDeleteSubstitute()
  // The remove dialog's target, lifted here only so its event count can be fetched — the dialog
  // itself stays the View's own state.
  const [removeTarget, setRemoveTarget] = useState<Substitute | null>(null)
  const { data: eventCount, isError: eventCountFailed } = useSubstituteEventCount(removeTarget?.id ?? null)

  // Each write resets the other, so the banner only ever shows the latest refusal.
  const activeError = updateSubstitute.error ?? deleteSubstitute.error
  const errorMessage = activeError
    ? activeError instanceof SubstituteError
      ? activeError.message
      : "Couldn't save the change — please try again."
    : null

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
      errorMessage={errorMessage}
      eventCount={removeTarget ? eventCount : undefined}
      eventCountFailed={eventCountFailed}
      onConfirmTargetChange={setRemoveTarget}
      onRename={(substitute, name) => {
        deleteSubstitute.reset()
        updateSubstitute.mutate({ ...currentState(substitute), name })
      }}
      onChangePosition={(substitute, positionId) => {
        deleteSubstitute.reset()
        updateSubstitute.mutate({ ...currentState(substitute), positionId })
      }}
      onChangeShirtNumber={(substitute, shirtNumber) => {
        deleteSubstitute.reset()
        updateSubstitute.mutate({ ...currentState(substitute), shirtNumber })
      }}
      onRemove={(substitute) => {
        updateSubstitute.reset()
        deleteSubstitute.mutate({ id: substitute.id })
      }}
    />
  )
}
