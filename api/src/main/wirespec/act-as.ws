// Act-as (ADR-0024): a Platform Admin enters a Team they are not a Member of, for 60 minutes sliding on activity. Distinct from POST /api/teams/{slug}/activate, the MEMBER's switch, which requires a membership - overloading that one would have hidden a cross-tenant entry behind an ordinary-looking call. This type is the Team the caller is currently inside plus when the box closes if they go idle; the team is what the persistent banner names, because twelve near-identically-named club squads is the exact condition under which a season gets prepped into the wrong one (ADR-0024 section 4).
type ActAs {
    team: TeamRef,
    expiresAt: String
}

type EnterActAsRequest {
    teamId: String
}

type PlatformTeamList {
    teams: TeamRef[]
}

// One episode of platform access, as the TEAM reads it. The actor is rendered generically via actorKind (MEMBER | PLATFORM_ADMIN) - no name lookup, and no operator email on a team-visible surface. exitedAt is null for an episode that ran out rather than being left deliberately; lastActiveAt is then the honest end of the window.
type ActAsRecord {
    actorKind: String,
    enteredAt: String,
    lastActiveAt: String,
    exitedAt: String?
}

type ActAsRecordList {
    records: ActAsRecord[]
}

// Every team on the platform. Restricting the LIST would be theatre - a Platform Admin owns the database; what makes this defensible is that ENTERING is explicit, boxed and recorded (ADR-0024 section 6).
endpoint ListPlatformTeams GET /api/admin/teams -> {
    200 -> PlatformTeamList
    403 -> Unit
}

// 404 covers a team id that does not exist. Unlike ActivateTeam there is no "not yours" to hide behind it: the caller is an authenticated platform admin who already sees every team in the console.
endpoint EnterActAs POST EnterActAsRequest /api/admin/act-as -> {
    200 -> ActAs
    403 -> Unit
    404 -> Unit
}

// Ungated, and a no-op when there is nothing open: closing your own grant can only ever reduce access, and refusing to let a lapsed caller tidy up would strand them.
endpoint ExitActAs POST /api/admin/act-as/exit -> {
    204 -> Unit
    401 -> Unit
}

// The Act-as Record for the caller's Active Team, newest first - visible to every Member, which is the point (ADR-0024 section 4).
endpoint ListActAsRecords GET /api/team/act-as-records -> {
    200 -> ActAsRecordList
    403 -> Unit
}
