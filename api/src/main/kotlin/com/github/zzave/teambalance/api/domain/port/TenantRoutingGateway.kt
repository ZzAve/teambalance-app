package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TenantRouting

/**
 * Where the caller's work happens: pin the team (and therefore the schema) that the signed-in
 * caller's subsequent requests belong to. A port so the sign-in flow can state that intent without
 * knowing the pin is a memo on the HTTP session — that, and the attribute names carrying it, are
 * the multitenancy adapter's business (ADR-0018).
 */
interface TenantRoutingGateway {

    /**
     * Pins [routing] for the caller, so the first authenticated burst of requests reads the tenant
     * back instead of several of them racing to memoize it (#205). Pinning it again is harmless.
     */
    fun pinRouting(routing: TenantRouting)

    /**
     * Drops any pinned routing, leaving the caller with **no** tenant rather than a stale one.
     *
     * Sign-in must call this before it pins, because pinning is conditional: a caller with no Team,
     * or with several and none remembered, resolves to nothing and pins nothing. Signing in over a
     * live session — a shared phone, a second magic link in the same browser — would otherwise leave
     * the previous caller's `(schema, teamId)` pair sitting on the session for the new one to
     * inherit. Clearing is the only operation that cannot be skipped.
     */
    fun clearRouting()
}
