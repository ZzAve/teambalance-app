package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.TokenHash
import java.time.Instant
import java.util.UUID

/** Platform-wide storage for the Bunq OAuth `state`; the callback has no tenant to look it up in. */
interface BunqOAuthStateRepository {
    fun save(state: BunqOAuthState)

    fun findByTokenHash(tokenHash: TokenHash): BunqOAuthState?

    /**
     * Marks the state used, only if it is still unused. True for exactly one caller, however many
     * race: the one that gets to proceed to the code exchange.
     */
    fun consume(id: UUID, now: Instant): Boolean

    /** Removes states that expired before [cutoff]. */
    fun deleteExpiredBefore(cutoff: Instant)
}
