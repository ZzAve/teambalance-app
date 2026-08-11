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
}
