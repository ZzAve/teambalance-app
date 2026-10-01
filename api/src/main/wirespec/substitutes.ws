// A person outside the Team whom the Team can call in for an Event (ADR-0033). Not a Member: no account, no Role, not on the Roster. `position` reuses the member's reference shape, since both are shown in the same Position groups.
type Substitute {
    id: String,
    name: String,
    position: MemberPosition?
}

type SubstituteList {
    substitutes: Substitute[]
}

// Ordered by name. Any Member may read it: the picker lists everyone the Team has called in before.
endpoint ListSubstitutes GET /api/substitutes -> {
    200 -> SubstituteList
}

// Any Member may create one, typically while calling them in for an Event.
type CreateSubstituteRequest {
    name: String,
    positionId: String?
}

endpoint CreateSubstitute POST CreateSubstituteRequest /api/substitutes -> {
    201 -> Substitute
    404 -> Unit
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

// Admin-only, like editing a Member: the name and the Position are saved together, so a Position change resends the current name. A changed Position applies to every Event the Substitute is on, past ones included, because Events read the Substitute's current Position.
type UpdateSubstituteRequest {
    name: String,
    positionId: String?
}

endpoint UpdateSubstitute PUT UpdateSubstituteRequest /api/substitutes/{id: String} -> {
    200 -> Substitute
    403 -> Unit
    404 -> Unit
}
