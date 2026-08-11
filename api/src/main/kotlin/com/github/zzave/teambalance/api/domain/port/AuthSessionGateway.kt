package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * The caller's authenticated session as the application sees it: start one at sign-in, read who it
 * belongs to, drop it at logout. A port so the inbound layer states the intent ("this user is now
 * signed in") without touching the session store itself (ADR-0018) — where the session lives (Spring
 * Session over Postgres) and which attribute names carry it are the adapter's business.
 */
interface AuthSessionGateway {

    /**
     * Starts an authenticated session for [userId]. Where that caller's work happens is a separate
     * question, answered by [TenantRoutingGateway].
     */
    fun startSession(userId: UserId)

    /** The user the current session belongs to, or null when the caller has no session. */
    fun currentUserId(): UserId?

    /** Drops the current session. A no-op when there is none. */
    fun endSession()
}
