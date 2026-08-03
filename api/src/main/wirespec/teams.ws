type CreateTeamRequest {
    name: String,
    creationCode: String
}

type Team {
    id: String,
    name: String,
    slug: String
}

endpoint CreateTeam POST CreateTeamRequest /api/teams -> {
    201 -> Team
    400 -> Unit
    403 -> Unit
    409 -> Unit
}
