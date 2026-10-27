package com.github.zzave.teambalance.api.domain.model

import java.time.Instant

/**
 * The team's access to Bunq (ADR-0042) and the one account its money pool reads. The connection
 * belongs to the team, so [connectedBy] records who connected it and is not an owner.
 *
 * [grant] and [connectedBy] are null only on a connection that was inserted directly, such as the
 * dev demo seed; the OAuth flow always sets both.
 */
data class BunqConnection(
    val accountId: BunqAccountId,
    val connectedAt: Instant,
    val grant: EncryptedToken? = null,
    val connectedBy: UserId? = null,
)
