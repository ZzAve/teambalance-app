package com.github.zzave.teambalance.api.infrastructure.identity

/**
 * The session attributes identity owns. The tenant-routing memo is *not* here: it belongs to the
 * multitenancy adapters that read and write it (`TenantRoutingSession`).
 */
object SessionKeys {
    const val USER_ID = "userId"
}
