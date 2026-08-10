package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * The caller's authenticated session as the application sees it: start one at sign-in, read who it
 * belongs to, drop it at logout. A port so the inbound layer states the intent ("this user is now
 * signed in") without touching the session store itself (ADR-0018) — where the session lives (Spring
 * Session over Postgres) and which attribute names carry it are the adapter's business.
 */
interface AuthSessionGateway {

    /**
     * Starts an authenticated session for [userId], additionally pinning [routing] when the user has
     * a team so the first authenticated burst reads the tenant back instead of several requests
     * racing to memoize it (#205). A teamless user passes null and nothing is pinned.
     */
    fun startSession(userId: UserId, routing: TenantRouting?)

    /** The user the current session belongs to, or null when the caller has no session. */
    fun currentUserId(): UserId?

    /** Drops the current session. A no-op when there is none. */
    fun endSession()
}
