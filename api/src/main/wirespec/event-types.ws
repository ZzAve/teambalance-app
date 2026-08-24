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

endpoint ListEventTypes GET /api/event-types -> {
    200 -> EventTypeList
}
