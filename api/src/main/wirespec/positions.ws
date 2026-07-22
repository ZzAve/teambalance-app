type Position {
    id: String,
    label: String
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
