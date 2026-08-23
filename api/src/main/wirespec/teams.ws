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

// Switches the caller's Active Team to the Team at this slug and returns it (ADR-0023 section 2). Addressed by slug, not id, because the slug is the Team's public address and is what a shared /t/:slug/... link carries - opening such a link IS this call. There is one kind of switch: a deliberate one and a link-induced one are the same request, and both are remembered as the caller's last-used Team. 404 covers both "no such slug" and "not yours", deliberately indistinguishable, so the Team address space cannot be probed for which Teams exist.
endpoint ActivateTeam POST /api/teams/{slug: String}/activate -> {
    200 -> TeamRef
    401 -> Unit
    404 -> Unit
}
