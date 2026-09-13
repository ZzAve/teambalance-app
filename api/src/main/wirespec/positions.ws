// Whether a position is played or staffed (#281). A headcount target is a target for PLAYERS: an admin asking for 12 at a training means twelve on the court, not eleven and the coach, so a STAFF attendee is shown but never counted toward it. PLAYING is the default and what every position created before the distinction existed is.
enum PositionKind {
    PLAYING,
    STAFF
}

type Position {
    id: String,
    label: String,
    kind: PositionKind
}

type PositionList {
    positions: Position[]
}

type CreatePositionRequest {
    label: String
}

type RenamePositionRequest {
    label: String
}

type SetPositionKindRequest {
    kind: PositionKind
}

endpoint ListPositions GET /api/positions -> {
    200 -> PositionList
    401 -> Unit
}

endpoint CreatePosition POST CreatePositionRequest /api/positions -> {
    201 -> Position
    403 -> Unit
    409 -> Unit
}

endpoint RenamePosition PUT RenamePositionRequest /api/positions/{id: String} -> {
    200 -> Position
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint DeletePosition DELETE /api/positions/{id: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
}

// Separate from RenamePosition rather than widening its body: the two are different admin gestures — a label is typed and saved, a kind is toggled and applies at once — and an endpoint called "rename" that also reclassifies a position would be a lie in the contract.
endpoint SetPositionKind PUT SetPositionKindRequest /api/positions/{id: String}/kind -> {
    200 -> Position
    403 -> Unit
    404 -> Unit
}
