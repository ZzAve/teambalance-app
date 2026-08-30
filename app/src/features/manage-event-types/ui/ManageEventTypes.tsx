import {
  EventTypeError,
  useArchiveEventType,
  useCreateEventType,
  useEventTypes,
  useUnarchiveEventType,
  useUpdateEventType,
} from '@shared/api/event-types'
import { usePositions } from '@shared/api/positions'
import { ManageEventTypesView } from './ManageEventTypesView'

/**
 * Container for event-type management: wires the event-type and position queries and the
 * create/update/archive/unarchive mutations to the presentational view. Pure wiring — the
 * load/error shells live in the View (props-driven), so this seam is covered by e2e, not a story.
 * See ADR-0017.
 *
 * It asks for archived types too: this is the one screen that shows them, and the only place they
 * can be restored from.
 */
export function ManageEventTypes() {
  const { data: eventTypes, isLoading, error } = useEventTypes(true)
  const { data: positions } = usePositions()
  const createEventType = useCreateEventType()
  const updateEventType = useUpdateEventType()
  const archiveEventType = useArchiveEventType()
  const unarchiveEventType = useUnarchiveEventType()

  const activeError = [
    createEventType.error,
    updateEventType.error,
    archiveEventType.error,
    unarchiveEventType.error,
  ].find((e): e is EventTypeError => e instanceof EventTypeError)

  const isSaving =
    createEventType.isPending ||
    updateEventType.isPending ||
    archiveEventType.isPending ||
    unarchiveEventType.isPending

  return (
    <ManageEventTypesView
      eventTypes={eventTypes}
      positions={positions}
      isLoading={isLoading}
      isError={!!error}
      isSaving={isSaving}
      errorCode={activeError?.code ?? null}
      onCreate={(draft) => createEventType.mutate(draft)}
      onUpdate={(id, draft) => updateEventType.mutate({ id, ...draft })}
      onArchive={(id, migrateEventsTo) => archiveEventType.mutate({ id, migrateEventsTo })}
      onUnarchive={(id) => unarchiveEventType.mutate({ id })}
    />
  )
}
