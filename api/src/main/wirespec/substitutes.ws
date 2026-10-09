// A person outside the Team whom the Team can call in for an Event (ADR-0033). Not a Member: no account, no Role, not on the Roster. `position` reuses the member's reference shape, since both are shown in the same Position groups. `shirtNumber` is the fixed number on the Substitute list (ADR-0038); it may equal a Member's.
type Substitute {
    id: String,
    name: String,
    position: MemberPosition?,
    shirtNumber: Integer?
}

type SubstituteList {
    substitutes: Substitute[]
}

// Ordered by name. Any Member may read it: the picker lists everyone the Team has called in before.
endpoint ListSubstitutes GET /api/substitutes -> {
    200 -> SubstituteList
}

// Any Member may create one, typically while calling them in for an Event. 409 when the name is already on the list, ignoring case: the picker tells Substitutes apart by name.
type CreateSubstituteRequest {
    name: String,
    positionId: String?
}

endpoint CreateSubstitute POST CreateSubstituteRequest /api/substitutes -> {
    201 -> Substitute
    404 -> Unit
    409 -> Unit
}

// Any Member may add a Substitute to an Event or change their state (ADR-0003). NOT_RESPONDED is refused with 400: a Substitute is never expected to answer.
type SetSubstituteAttendanceRequest {
    state: AttendanceState
}

endpoint SetSubstituteAttendance PUT SetSubstituteAttendanceRequest /api/events/{eventId: String}/substitutes/{substituteId: String} -> {
    200 -> SubstituteEntry
    400 -> Unit
    404 -> Unit
}

// Takes the Substitute off this Event. 404 when they were not on it.
endpoint RemoveSubstituteAttendance DELETE /api/events/{eventId: String}/substitutes/{substituteId: String} -> {
    204 -> Unit
    404 -> Unit
}

// Admin-only, like editing a Member: the name, the Position and the Shirt Number are saved together, so changing one resends the others; a missing or null `shirtNumber` clears it. A changed Position applies to every Event the Substitute is on, past ones included, because Events read the Substitute's current Position. 409 SUBSTITUTE_NAME_TAKEN or NUMBER_TAKEN: a number is unique among Substitutes only (ADR-0038); 400 outside 0..999.
type UpdateSubstituteRequest {
    name: String,
    positionId: String?,
    shirtNumber: Integer?
}

endpoint UpdateSubstitute PUT UpdateSubstituteRequest /api/substitutes/{id: String} -> {
    200 -> Substitute
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

// Admin-only, and there is no restore. Removing a Substitute takes them off every Event, past ones included, the same rule as a departed Member (ADR-0009).
endpoint DeleteSubstitute DELETE /api/substitutes/{id: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
}

// How many Events the Substitute is on, past ones included: what removing them takes them off. Admin-only, since only the remove dialog reads it.
type SubstituteUsage {
    eventCount: Integer
}

endpoint GetSubstituteUsage GET /api/substitutes/{id: String}/usage -> {
    200 -> SubstituteUsage
    403 -> Unit
    404 -> Unit
}
