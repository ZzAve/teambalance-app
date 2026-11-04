package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext

/**
 * Where the Bunq API session of the current team's connection is kept between requests and between instances, encrypted:
 * the installation, device and session that [BunqGateway] reads need. Setting one up is three calls to an endpoint Bunq
 * limits to about ten a day, so it is done once per connection and not per read.
 *
 * Both calls act on the connection of the tenant that is in scope, and do nothing outside a tenant scope or while that
 * team has no connection row. The tenant in scope is not always the team the caller's grant belongs to: while an Admin
 * is connecting, the callback runs in the tenant of the Admin's active team, which can be another team, and a read can
 * still be running when a reconnect replaces the grant. So a caller finds the grant the row holds first, writes only if
 * it is the caller's own, and [save] repeats that check in the write itself.
 */
interface BunqApiContextRepository {
    fun find(): StoredBunqApiContext?

    /** Writes only while the row still holds [ifGrant]. False, and nothing written, if it does not, or there is no row. */
    fun save(context: EncryptedToken, ifGrant: EncryptedToken): Boolean
}
