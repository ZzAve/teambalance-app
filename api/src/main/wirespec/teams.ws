type CreateTeamRequest {
    name: String,
    slug: String,
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

// Addressed by slug because that is what a shared /t/:slug/... link carries - opening such a link IS this call (ADR-0023 section 2). 404 covers both "no such slug" and "not yours", deliberately indistinguishable.
endpoint ActivateTeam POST /api/teams/{slug: String}/activate -> {
    200 -> TeamRef
    401 -> Unit
    404 -> Unit
}
