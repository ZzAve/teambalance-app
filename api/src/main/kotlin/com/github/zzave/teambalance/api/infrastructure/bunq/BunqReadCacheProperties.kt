package com.github.zzave.teambalance.api.infrastructure.bunq

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

/** How long the money pool answers from memory, bound from `teambalance.bunq.read-cache.*`. */
@ConfigurationProperties(prefix = "teambalance.bunq.read-cache")
data class BunqReadCacheProperties(
    /** After this long the next read asks Bunq again, within that request. */
    val refresh: Duration,
    /** The last known balance is dropped this long after it was read. Must be at least [refresh]. */
    val expire: Duration,
    /** After Bunq failed to answer, it is not asked again for this long (per team). */
    val retryAfter: Duration,
) {
    init {
        require(refresh <= expire) { "teambalance.bunq.read-cache.refresh ($refresh) must not exceed expire ($expire)" }
    }
}
