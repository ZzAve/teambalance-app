import type { SubstituteEntry } from '@shared/api/events'
import { usePositions } from '@shared/api/positions'
import {
  useCreateSubstitute,
  useSetSubstituteAttendance,
  usePendingSubstituteEvents,
  useSubstitutes,
} from '@shared/api/substitutes'
import type { PositionRef } from '@entities/event/lib/lineup'
import { SubstitutePickerView } from './SubstitutePickerView'

interface PickerEvent {
  id: string
  title: string
  substitutes: SubstituteEntry[]
}

/**
 * The Substitute picker's container (ADR-0017): the Team's list, the Positions and the two writes,
 * around the prop-only [SubstitutePickerView]. The event page and the list page's lineup panel both
 * render this one. The caller keeps `event` and `position` while closing, so the sheet can animate out.
 */
export function SubstitutePicker({
  open,
  event,
  position = null,
  onClose,
}: {
  open: boolean
  event: PickerEvent | null
  /** Opened from one Position's open spot; null for the unfiltered picker. */
  position?: PositionRef | null
  onClose: () => void
}) {
  const positions = usePositions({ enabled: open })
  const teamSubstitutes = useSubstitutes({ enabled: open })
  const createSubstitute = useCreateSubstitute()
  const setSubstituteAttendance = useSetSubstituteAttendance()
  const pendingEvents = usePendingSubstituteEvents()

  if (!event) return null
  const eventId = event.id
  // A retry after a failure is a fetch in the error status, and a paused one (offline) is neither
  // fetching nor failed: both read as loading, so the list never reads as empty before it exists.
  const listFailed = teamSubstitutes.isError && !teamSubstitutes.isFetching

  return (
    <SubstitutePickerView
      open={open}
      eventTitle={event.title}
      position={position}
      positions={positions.data ?? []}
      positionsError={positions.isError && !positions.isFetching}
      onRetryPositions={() => positions.refetch()}
      substitutes={teamSubstitutes.data ?? []}
      isLoading={!teamSubstitutes.isSuccess && !listFailed}
      isError={listFailed}
      onRetry={() => teamSubstitutes.refetch()}
      pending={pendingEvents.includes(eventId)}
      onEvent={event.substitutes}
      onSetState={(substituteId, state) => setSubstituteAttendance.mutate({ eventId, substituteId, state })}
      // Someone new has been asked, not confirmed: they join the event as Maybe.
      onCreate={(name, positionId) =>
        createSubstitute.mutateAsync(
          { name, positionId },
          { onSuccess: (sub) => setSubstituteAttendance.mutate({ eventId, substituteId: sub.id, state: 'MAYBE' }) },
        )
      }
      onClose={onClose}
    />
  )
}
