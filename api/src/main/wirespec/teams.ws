type CreateTeamRequest {
    name: String,
    slug: String,
    creationCode: String
}

// A Platform Admin provisions a Team with NO members at all (ADR-0024 section 5): the tenant schema and the teams row, and not one team_members row - the teamless invariant (ADR-0024 section 3) forbids the platform account ever holding a membership. No creation code: the platform-admin allowlist on /admin is a stronger gate than a code the admin would only be minting for themselves. The creator does NOT become the founder or the Active Team; they enter via act-as and hand the team over with an ADMIN invite link.
type CreateMemberlessTeamRequest {
    name: String,
    slug: String
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

// Lives in the /admin group beside the console and creation codes - same platform-admin allowlist, no new auth surface (ADR-0024 section 6). 403 is the allowlist refusing a non-admin; the memberless path is deliberately kept off POST /api/teams so "insert no member" is never reachable from the self-service founder flow.
endpoint CreateMemberlessTeam POST CreateMemberlessTeamRequest /api/admin/teams -> {
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
