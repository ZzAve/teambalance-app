import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract types so consumers have a single source of truth. The roster
// types live here rather than in events.ts because the event type is where a team *authors* them;
// an event only ever carries an override of one (see events.ts).
export type { EventTypeItem } from './generated/model/EventTypeItem'
export type { RosterRequirement } from './generated/model/RosterRequirement'
export type { PositionTarget } from './generated/model/PositionTarget'

import type { EventTypeItem } from './generated/model/EventTypeItem'
import type { RosterRequirement } from './generated/model/RosterRequirement'

// An event-type mutation can fail in ways the UI must tell apart: a taken name is recoverable and
// shown inline, archiving the last active type is a rule the admin needs explained, and a bad
// migration target means the picker offered something stale. Mirrors PositionError in positions.ts.
export class EventTypeError extends Error {
  constructor(
    public readonly code:
      | 'EVENT_TYPE_NAME_TAKEN'
      | 'LAST_EVENT_TYPE'
      | 'INVALID_REQUEST'
      | 'FORBIDDEN'
      | 'NOT_FOUND',
    message: string,
  ) {
    super(message)
    this.name = 'EventTypeError'
  }
}

// A 409 means one of two very different things, and the caller has to say which — the server sends a
// discriminating `code`, but the generated client models the body as Unit, so the status is all we
// have here. The archive path is the only one that can hit LAST_EVENT_TYPE, so it maps its own.
const nameTaken = () => new EventTypeError('EVENT_TYPE_NAME_TAKEN', 'That event type already exists.')
// The 400s this surface can produce: a blank or over-long name, a roster target naming a position
// that is not this team's, or a migration target that went stale between rendering and clicking.
// Declared in the contract precisely so they arrive here as a classified error rather than as an
// undeclared-status throw the UI cannot tell from a network failure.
const invalid = () => new EventTypeError('INVALID_REQUEST', "That didn't work — check the name and roster, then try again.")
const forbidden = () => new EventTypeError('FORBIDDEN', 'You are not allowed to make this change.')
const notFound = () => new EventTypeError('NOT_FOUND', 'Event type not found.')

/**
 * The team's event types. Archived ones are excluded unless asked for, so every picker gets exactly
 * the types a team can still choose; only the admin screen passes `includeArchived`.
 *
 * Keyed by that flag so the two lists cache separately — an admin screen showing archived types must
 * not poison the picker's cache with rows it should never offer.
 */
export function useEventTypes(includeArchived = false) {
  return useQuery({
    queryKey: ['event-types', { includeArchived }],
    queryFn: async () => {
      const res = await api.ListEventTypes({ 'include-archived': includeArchived })
      return res.body
    },
    select: (data) => data.eventTypes,
    staleTime: Infinity,
  })
}

interface EventTypeInput {
  name: string
  color?: string
  rosterDefault: RosterRequirement
}

export function useCreateEventType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: EventTypeInput) => {
      const res = await api.CreateEventType({ body: input as EventTypeItem })
      if (res.status === 400) throw invalid()
      if (res.status === 409) throw nameTaken()
      if (res.status === 403) throw forbidden()
      return res.body
    },
    onSuccess: () => invalidate(queryClient),
  })
}

export function useUpdateEventType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: EventTypeInput & { id: string }) => {
      const res = await api.UpdateEventType({ id, body: input as EventTypeItem })
      if (res.status === 400) throw invalid()
      if (res.status === 409) throw nameTaken()
      if (res.status === 403) throw forbidden()
      if (res.status === 404) throw notFound()
      return res.body
    },
    onSuccess: () => invalidate(queryClient),
  })
}

/**
 * Archive (soft delete), optionally moving this type's events onto another active one first.
 *
 * A 409 here is the last-active-type rule rather than a name clash — archiving carries no name — and
 * a 400 means the migration target went stale between the picker rendering and the click.
 */
export function useArchiveEventType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, migrateEventsTo }: { id: string; migrateEventsTo?: string }) => {
      const res = await api.ArchiveEventType({ id, body: { migrateEventsTo } })
      if (res.status === 400) throw invalid()
      if (res.status === 409) {
        throw new EventTypeError('LAST_EVENT_TYPE', 'A team must keep at least one active event type.')
      }
      if (res.status === 403) throw forbidden()
      if (res.status === 404) throw notFound()
      return res.body
    },
    // Archiving moves events onto another type, so the events cache is stale too.
    onSuccess: () => invalidate(queryClient),
  })
}

export function useUnarchiveEventType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.UnarchiveEventType({ id })
      if (res.status === 409) throw nameTaken()
      if (res.status === 403) throw forbidden()
      if (res.status === 404) throw notFound()
      return res.body
    },
    onSuccess: () => invalidate(queryClient),
  })
}

// Both event-type lists AND the events themselves: a type's roster default is resolved into every
// inheriting event's computed roster, so editing one changes the events payload without touching an
// event row. Archiving with a migration rewrites the events' type outright.
function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['event-types'] })
  queryClient.invalidateQueries({ queryKey: ['events'] })
}
