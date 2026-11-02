package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken

/** The current tenant's Bunq connection, if the team has connected one. */
interface BunqConnectionRepository {
    fun find(): BunqConnection?

    /** Replaces the connection, if any. */
    fun save(connection: BunqConnection)

    /**
     * Sets only the picked account, and only while the stored grant is still [ifGrant]. False when the
     * connection was deleted or replaced in the meantime, in which case nothing is written.
     */
    fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken): Boolean

    /** Removes the connection; a no-op when there is none. */
    fun delete()
}
