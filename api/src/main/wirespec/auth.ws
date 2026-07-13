type RequestMagicLinkRequest {
    email: String
}

type VerifyMagicLinkRequest {
    token: String
}

type AuthenticatedUser {
    id: String,
    email: String,
    displayName: String,
    role: String?
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
