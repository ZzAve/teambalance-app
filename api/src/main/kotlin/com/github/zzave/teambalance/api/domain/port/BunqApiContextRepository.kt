package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EncryptedToken

/**
 * Where the Bunq API session of the current team's connection is kept between requests and between instances, encrypted:
 * the installation, device and session that [BunqGateway] reads need. Setting one up is three calls to an endpoint Bunq
 * limits to about ten a day, so it is done once per connection and not per read.
 *
 * Both calls act on the current tenant's connection and do nothing outside a tenant scope or while the team has no
 * connection row. That is the case while an Admin is still connecting: the session is then held in memory and stored
 * by the first read that finds the row.
 */
interface BunqApiContextRepository {
    fun find(): EncryptedToken?

    /** False, and nothing written, when there is no connection to hold it. */
    fun save(context: EncryptedToken): Boolean
}
