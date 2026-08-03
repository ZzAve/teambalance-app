package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import java.time.Instant

/**
 * Access to the platform's one-time team-creation codes: the redeemability peek used by create-team,
 * plus the list/insert/delete used by the codes-admin CRUD (#154 Slice 4). Consumption is not here:
 * it must be atomic with the team/member inserts, so it lives in [TeamRegistrar.register] inside that
 * transaction.
 */
interface TeamCreationCodeRepository {
    /**
     * True if [code] is currently redeemable at [now] — it exists, is unconsumed, and is unexpired.
     * A pre-provision peek only: it lets create-team reject an obviously-bad code with a 403 *before*
     * provisioning a schema, so bad-code spam can't accrete orphan schemas. The authoritative,
     * race-free check is the conditional UPDATE in [TeamRegistrar.register].
     */
    fun isRedeemable(code: String, now: Instant): Boolean

    /** Every code, newest-created first — the codes-admin list view. */
    fun findAll(): List<TeamCreationCode>

    /** The code with this value, or null if none exists. */
    fun findByCode(code: String): TeamCreationCode?

    /** Inserts a fresh, unconsumed code and returns it. [expiresAt] null = never expires. */
    fun insert(code: String, createdAt: Instant, expiresAt: Instant?): TeamCreationCode

    /** Removes the code with this value. No-op if it does not exist. */
    fun delete(code: String)
}
