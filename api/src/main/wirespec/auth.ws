type RequestMagicLinkRequest {
    email: String
}

type VerifyMagicLinkRequest {
    token: String
}

type TeamRef {
    id: String,
    name: String,
    slug: String
}

// The route gate reads BOTH: empty `teams` means teamless, while a non-empty `teams` with a null `activeTeam` means "a Member of several, none chosen yet" - a choice, not an error. `role` is the Role IN THE ACTIVE TEAM, so it is null exactly when `activeTeam` is (ADR-0023).
type AuthenticatedUser {
    id: String,
    email: String,
    displayName: String,
    role: String?,
    teams: TeamRef[],
    activeTeam: TeamRef?,
    isPlatformAdmin: Boolean
}

endpoint RequestMagicLink POST RequestMagicLinkRequest /api/auth/magic-link/request -> {
    202 -> Unit
}

endpoint VerifyMagicLink POST VerifyMagicLinkRequest /api/auth/magic-link/verify -> {
    200 -> AuthenticatedUser
    401 -> Unit
}

endpoint Logout POST /api/auth/logout -> {
    204 -> Unit
}

endpoint GetAuthMe GET /api/auth/me -> {
    200 -> AuthenticatedUser
    401 -> Unit
}
