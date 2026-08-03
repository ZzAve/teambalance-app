package com.github.zzave.teambalance.api.domain.port

import java.time.Instant

/**
 * Read-side access to the platform's one-time team-creation codes. Consumption is not here: it must be
 * atomic with the team/member inserts, so it lives in [TeamRegistrar.register] inside that transaction.
 */
interface TeamCreationCodeRepository {
    /**
     * True if [code] is currently redeemable at [now] — it exists, is unconsumed, and is unexpired.
     * A pre-provision peek only: it lets create-team reject an obviously-bad code with a 403 *before*
     * provisioning a schema, so bad-code spam can't accrete orphan schemas. The authoritative,
     * race-free check is the conditional UPDATE in [TeamRegistrar.register].
     */
    fun isRedeemable(code: String, now: Instant): Boolean
}
