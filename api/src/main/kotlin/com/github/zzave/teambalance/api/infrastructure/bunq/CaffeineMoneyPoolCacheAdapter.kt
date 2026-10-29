package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.Expiry
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.Instant
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Per-instance, in-memory [MoneyPoolCacheGateway] (ADR-0037 makes the same trade for the rate limiter).
 * Another instance holds its own entries, so after a connect, pick or disconnect handled elsewhere an
 * instance can show the old outcome until its value is refreshed, or expired at [BunqReadCacheProperties.expire].
 * A cached [MoneyPool.Rejected] has no time limit, so on another instance it lasts until a restart.
 *
 * A read after [BunqReadCacheProperties.refresh] asks Bunq inside that request, and not through
 * Caffeine's refreshAfterWrite: that reloads on a pool thread, where the tenant of the request is gone.
 * While one request does so, concurrent readers get the stale value. A failed attempt leaves the entry
 * as it is, so Caffeine's expiry keeps counting from the last successful read.
 *
 * Bridges Caffeine's clock to the injected [Clock], as [com.github.zzave.teambalance.api.infrastructure.ratelimit.RateLimiter]
 * does for Bucket4j, so timing is deterministic under a test clock.
 */
@Component
class CaffeineMoneyPoolCacheAdapter(
    private val clock: Clock,
    private val properties: BunqReadCacheProperties,
) : MoneyPoolCacheGateway {

    private data class Key(val teamId: TeamId, val account: BunqAccountId)

    private class Entry(val value: MoneyPool, val readAt: Instant) {
        /** Set when a refresh found Bunq unavailable; no new attempt before then. */
        @Volatile
        var retryNotBefore: Instant? = null
        val refreshing = AtomicBoolean(false)
    }

    private val entries: Cache<Key, Entry> = Caffeine.newBuilder()
        .maximumSize(MAX_ENTRIES)
        .ticker { TimeUnit.MILLISECONDS.toNanos(clock.millis()) }
        .expireAfter(
            object : Expiry<Key, Entry> {
                override fun expireAfterCreate(key: Key, entry: Entry, currentTime: Long) = lifetimeNanos(entry.value)

                override fun expireAfterUpdate(key: Key, entry: Entry, currentTime: Long, currentDuration: Long) =
                    lifetimeNanos(entry.value)

                override fun expireAfterRead(key: Key, entry: Entry, currentTime: Long, currentDuration: Long) = currentDuration
            },
        )
        .build()

    override fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool {
        val key = Key(teamId, account)
        val entry = entries.getIfPresent(key) ?: return coldRead(key, teamId, load)
        return if (entry.value is MoneyPool.Connected && refreshIsDue(entry)) refresh(key, entry, teamId, load) else entry.value
    }

    override fun evict(teamId: TeamId) {
        entries.asMap().keys.removeIf { it.teamId == teamId }
    }

    /** Drops everything; for tests that share a context. */
    fun invalidateAll() = entries.invalidateAll()

    /** Concurrent cold readers wait for the one read that computes the entry: there is nothing to show them meanwhile. */
    private fun coldRead(key: Key, teamId: TeamId, load: () -> MoneyPool): MoneyPool =
        entries.get(key) { Entry(readFromBunq(teamId, load), clock.instant()) }.value

    private fun refreshIsDue(entry: Entry): Boolean = !clock.instant().isBefore(entry.readAt.plus(properties.refresh))

    private fun refresh(key: Key, entry: Entry, teamId: TeamId, load: () -> MoneyPool): MoneyPool {
        val retryNotBefore = entry.retryNotBefore
        val backingOff = retryNotBefore != null && clock.instant().isBefore(retryNotBefore)
        if (backingOff || !entry.refreshing.compareAndSet(false, true)) return entry.value
        return try {
            val answer = readFromBunq(teamId, load)
            if (answer == MoneyPool.Unavailable) {
                entry.retryNotBefore = clock.instant().plus(properties.retryAfter)
                entry.value
            } else {
                entries.put(key, Entry(answer, clock.instant()))
                answer
            }
        } finally {
            entry.refreshing.set(false)
        }
    }

    private fun readFromBunq(teamId: TeamId, load: () -> MoneyPool): MoneyPool {
        log.debug("Reading the money pool from Bunq for team {}", teamId)
        return load()
    }

    /** A value is remembered for [BunqReadCacheProperties.expire], an Unavailable for the retry interval, a Rejected for good. */
    private fun lifetimeNanos(value: MoneyPool): Long =
        when (value) {
            is MoneyPool.Connected -> properties.expire.toNanos()
            MoneyPool.Unavailable -> properties.retryAfter.toNanos()
            else -> Long.MAX_VALUE
        }

    private companion object {
        const val MAX_ENTRIES = 1_000L
        val log = LoggerFactory.getLogger(CaffeineMoneyPoolCacheAdapter::class.java)
    }
}
