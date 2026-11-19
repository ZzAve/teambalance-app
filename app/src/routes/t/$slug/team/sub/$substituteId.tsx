import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCurrentUser } from '@shared/api/auth'
import { usePositions } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import {
  SubstituteError,
  useDeleteSubstitute,
  useSubstituteEventCount,
  useSubstitutes,
  useUpdateSubstitute,
} from '@shared/api/substitutes'
import { teamRoutes } from '@shared/lib/team-routes'
import { SubstituteDetailView } from '@pages/substitute/ui/SubstituteDetailView'

export const Route = createFileRoute('/t/$slug/team/sub/$substituteId')({
  component: SubstituteDetailPage,
})

// The update saves the whole Substitute, so every edit starts from what they have now.
// `?? null`: the API sends null for "none" although the generated types say undefined.
const currentState = (substitute: Substitute) => ({
  id: substitute.id,
  name: substitute.name,
  positionId: substitute.position?.id ?? null,
  shirtNumber: substitute.shirtNumber ?? null,
})

/**
 * Container for one Substitute's page (ADR-0033): reads the substitutes list the /team page already
 * filled and wires the Admin's update and delete, and the remove dialog's event count. Pure wiring;
 * the View's stories cover its states. No e2e drives it: an Admin write inside the tenant, the same
 * kind of change as managing Positions, adds no seam the existing flows miss. See ADR-0017.
 */
function SubstituteDetailPage() {
  const { slug, substituteId } = Route.useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAdmin = useCurrentUser()?.role === 'ADMIN'
  const { data: substitutes, isLoading, error } = useSubstitutes()
  const { data: positions } = usePositions()
  const updateSubstitute = useUpdateSubstitute()
  const deleteSubstitute = useDeleteSubstitute()
  const [countWanted, setCountWanted] = useState(false)
  const { data: eventCount, isError: eventCountFailed } = useSubstituteEventCount(countWanted ? substituteId : null)

  const substitute = substitutes?.find((s) => s.id === substituteId)
  // Each write resets the other, so the banner only ever shows the latest refusal.
  const activeError = updateSubstitute.error ?? deleteSubstitute.error
  const errorMessage = activeError
    ? activeError instanceof SubstituteError
      ? activeError.message
      : t('manageSubstitutes.saveFailed')
    : undefined
  const save = (change: Partial<ReturnType<typeof currentState>>) => {
    if (!substitute) return
    deleteSubstitute.reset()
    updateSubstitute.mutate({ ...currentState(substitute), ...change })
  }

  return (
    <SubstituteDetailView
      substitute={substitute}
      positions={positions ?? []}
      isLoading={isLoading}
      isError={!!error}
      canManage={isAdmin}
      isSaving={updateSubstitute.isPending || deleteSubstitute.isPending}
      errorMessage={errorMessage}
      eventCount={countWanted ? eventCount : undefined}
      eventCountFailed={eventCountFailed}
      onRemoveDialogChange={setCountWanted}
      onChangePosition={(positionId) => save({ positionId })}
      onRename={(name) => save({ name })}
      onChangeShirtNumber={(shirtNumber) => save({ shirtNumber })}
      onRemove={() => {
        updateSubstitute.reset()
        deleteSubstitute.mutate({ id: substituteId }, { onSuccess: () => navigate({ to: teamRoutes(slug).team }) })
      }}
    />
  )
}
