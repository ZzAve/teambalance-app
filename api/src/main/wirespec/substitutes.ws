// A person outside the Team whom the Team can call in for an Event (ADR-0033). Not a Member: no account, no Role, not on the Roster. `position` reuses the member's reference shape, since both are shown in the same Position groups.
type Substitute {
    id: String,
    name: String,
    position: MemberPosition?
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
