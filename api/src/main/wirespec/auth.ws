type RequestMagicLinkRequest {
    email: String,
    inviteToken: String?
}

type VerifyMagicLinkRequest {
    token: String
}

type TeamRef {
    id: String,
    name: String,
    slug: String
}

// The route gate reads BOTH: empty `teams` means teamless, while a non-empty `teams` with a null `activeTeam` means "a Member of several, none chosen yet" - a choice, not an error. `role` is the Role IN THE ACTIVE TEAM, so it is null exactly when `activeTeam` is (ADR-0023). `actAs` is non-null only while a Platform Admin is inside a Team (ADR-0024): it is what the banner names and what the gate's third branch reads, and while it is set `activeTeam` is that Team and `role` is the synthesized ADMIN - the Virtual Member - even though `teams` stays empty, because a Platform Admin is never a Member.
type AuthenticatedUser {
    id: String,
    email: String,
    displayName: String,
    role: String?,
    teams: TeamRef[],
    activeTeam: TeamRef?,
    isPlatformAdmin: Boolean,
    actAs: ActAs?
}

// What a magic-link verification produces. `inviteOutcome` is null for an ordinary sign-in, and for one requested from an Invite Link it reports what became of that invite: JOINED, or UNAVAILABLE when the link expired or was rotated between the request and the click. The sign-in itself succeeds either way - landing signed-in but teamless is a legitimate state with its own onboarding hub, so a dead invite no longer withholds the session (amends ADR-0008). Deliberately coarse: accept collapses unknown, expired and spent into one refusal, and this reports on it without being more talkative.
type VerifiedSession {
    user: AuthenticatedUser,
    inviteOutcome: String?
}

endpoint RequestMagicLink POST RequestMagicLinkRequest /api/auth/magic-link/request -> {
    202 -> Unit
    404 -> Unit
}

endpoint VerifyMagicLink POST VerifyMagicLinkRequest /api/auth/magic-link/verify -> {
    200 -> VerifiedSession
    401 -> Unit
}

endpoint Logout POST /api/auth/logout -> {
    204 -> Unit
}

endpoint GetAuthMe GET /api/auth/me -> {
    200 -> AuthenticatedUser
    401 -> Unit
}
