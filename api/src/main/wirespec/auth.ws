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

// `teams` is every Team the caller is an active Member of; `activeTeam` is the one this request is scoped to - the Active Team (ADR-0023). The route gate reads BOTH: an empty `teams` means teamless (send them to onboarding), while a non-empty `teams` with a null `activeTeam` means "a Member of several, none chosen yet" - a choice to make, not an error. Never infer either from `role`. And `role` is the caller's Role IN THE ACTIVE TEAM, so it is null exactly when `activeTeam` is: a Member of two Teams has two Roles, and only the active one is theirs for this request, which is why it cannot be a property of the user alone.
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
