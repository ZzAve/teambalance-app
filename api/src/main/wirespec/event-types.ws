// How many attending people an event needs at one position. Declared here (event types own the team-wide defaults) but shared with events.ws, which reuses it for a single event's override.
type PositionTarget {
    positionId: String,
    count: Integer
}

// The roster a team wants for an event: a headcount, a per-position lineup, or both — the two axes are independent and either may be absent or partial (a Match sets per-position counts, a Training often only a total, a social neither). `trackRoster` is an explicit flag rather than "no targets means off", because "tracking on with no hard requirement" (a training that just tallies who is coming, per position) is a real state, and a distinct one from "not a roster event at all" (a social, which renders no panel). Targets are kept while `trackRoster` is false, so toggling tracking off and back on does not discard the configuration.
type RosterRequirement {
    trackRoster: Boolean,
    totalTarget: Integer?,
    positionTargets: PositionTarget[]
}

// `archived` is a soft delete: an archived type is hidden from the create/edit pickers, but every event that already holds it keeps rendering with it. An event's type is non-null, so a type is never hard-deleted out from under its events.
type EventTypeItem {
    id: String,
    name: String,
    color: String?,
    archived: Boolean,
    rosterDefault: RosterRequirement
}

type EventTypeList {
    eventTypes: EventTypeItem[]
}

type CreateEventTypeRequest {
    name: String,
    color: String?,
    rosterDefault: RosterRequirement
}

// A whole replacement of the type's editable fields — name, colour and roster default together. Archiving is NOT here: it is a separate, destructive operation with its own confirmation and its own migration step.
type UpdateEventTypeRequest {
    name: String,
    color: String?,
    rosterDefault: RosterRequirement
}

// `migrateEventsTo` moves every event of this type onto another ACTIVE type before archiving, which is what the admin UI offers first. Null archives the type and leaves its events holding it: they keep rendering, and the type simply stops appearing in the pickers. An event's type is non-null, so neither path ever orphans or deletes an event.
type ArchiveEventTypeRequest {
    migrateEventsTo: String?
}

// What a position is currently used by, so the delete confirmation can say what it is about to touch rather than warning in the abstract. Deleting proceeds regardless — this is a warning, not a veto.
type PositionUsage {
    eventTypeCount: Integer,
    eventCount: Integer,
    memberCount: Integer
}

// Archived types are excluded unless `include-archived` is true — that exclusion is what makes archiving hide a type from every create/edit picker without touching the events that hold it. The admin screen asks for them so it can list and restore them.
endpoint ListEventTypes GET /api/event-types ? {include-archived: Boolean?} -> {
    200 -> EventTypeList
}

endpoint CreateEventType POST CreateEventTypeRequest /api/event-types -> {
    201 -> EventTypeItem
    400 -> Unit
    403 -> Unit
    409 -> Unit
}

endpoint UpdateEventType PUT UpdateEventTypeRequest /api/event-types/{id: String} -> {
    200 -> EventTypeItem
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint ArchiveEventType POST ArchiveEventTypeRequest /api/event-types/{id: String}/archive -> {
    200 -> EventTypeItem
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint UnarchiveEventType POST /api/event-types/{id: String}/unarchive -> {
    200 -> EventTypeItem
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint GetPositionUsage GET /api/positions/{id: String}/usage -> {
    200 -> PositionUsage
    403 -> Unit
    404 -> Unit
}
