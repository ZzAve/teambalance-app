package com.github.zzave.teambalance.api.domain.model

import java.time.Instant

/**
 * The team's access to Bunq (ADR-0042). [accountId] is null between approving at Bunq and the Admin
 * picking one of the grant's accounts; the money pool reads nothing until then. The connection belongs
 * to the team, so [connectedBy] is a record of who connected it, not an owner.
 */
data class BunqConnection(
    val accountId: BunqAccountId?,
    val grant: EncryptedToken,
    val connectedBy: UserId,
    val connectedAt: Instant,
)
