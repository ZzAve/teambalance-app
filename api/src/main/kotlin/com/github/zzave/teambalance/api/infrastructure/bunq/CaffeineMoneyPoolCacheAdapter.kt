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
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong

/**
 * Per-instance, in-memory [MoneyPoolCacheGateway] (ADR-0037 makes the same trade for the rate limiter).
 * Another instance holds its own entries, so after a connect, pick or disconnect handled elsewhere an
 * instance can show the old outcome until its value is refreshed, or expired at [BunqReadCacheProperties.expire].
 * A cached [MoneyPool.Rejected] has no time limit, so on another instance it lasts until that instance
 * restarts or one of its own connect, pick, disconnect or rejected list or pick evicts it.
 *
 * A read after [BunqReadCacheProperties.refresh] asks Bunq inside that request, and not through
 * Caffeine's refreshAfterWrite: that reloads on a pool thread, where the tenant of the request is gone.
 * While one request does so, concurrent readers get the stale value. A failed attempt leaves the entry
 * as it is, so Caffeine's expiry keeps counting from the last successful read.
 *
 * An [evict] during a read that is in flight must not be undone by that read, which may have used the
 * grant that was just replaced. A refresh stores its answer only if its entry is still the mapped one
 * (so an evict, which removes it, wins). A cold read has no entry to compare, so [evict] also bumps a
 * per-team generation, and a cold read that sees it change removes the entry it just stored. Either the
 * evict's removal sees that entry or the read sees the new generation. The generations are one [Long]
 * per team that was ever evicted: bounded by the number of teams, which is small.
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

    private val generations = ConcurrentHashMap<TeamId, AtomicLong>()

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
        val entry = entries.getIfPresent(key) ?: return coldRead(key, load)
        return if (entry.value is MoneyPool.Connected && refreshIsDue(entry)) refresh(key, entry, load) else entry.value
    }

    override fun evict(teamId: TeamId) {
        generations.computeIfAbsent(teamId) { AtomicLong() }.incrementAndGet()
        entries.asMap().keys.removeIf { it.teamId == teamId }
    }

    private fun generationOf(teamId: TeamId): Long = generations[teamId]?.get() ?: 0L

    /**
     * Concurrent cold readers wait for the one read that computes the entry: there is nothing to show them
     * meanwhile. An answer that an [evict] overtook is removed again; the reader that loaded it still gets it.
     */
    private fun coldRead(key: Key, load: () -> MoneyPool): MoneyPool {
        var generation = 0L
        var loadedHere: Entry? = null
        val entry = entries.get(key) {
            generation = generationOf(key.teamId)
            Entry(readFromBunq(key.teamId, load), clock.instant()).also { loadedHere = it }
        }
        if (entry === loadedHere && generationOf(key.teamId) != generation) entries.asMap().remove(key, entry)
        return entry.value
    }

    private fun refreshIsDue(entry: Entry): Boolean = !clock.instant().isBefore(entry.readAt.plus(properties.refresh))

    /**
     * The claim is taken before anything is decided, so a reader that waited for the flag sees what the
     * one before it left: a replaced or evicted entry, or a retry time.
     */
    private fun refresh(key: Key, entry: Entry, load: () -> MoneyPool): MoneyPool {
        if (!entry.refreshing.compareAndSet(false, true)) return entry.value
        return try {
            val retryNotBefore = entry.retryNotBefore
            when {
                entries.getIfPresent(key) !== entry -> read(key.teamId, key.account, load)
                retryNotBefore != null && clock.instant().isBefore(retryNotBefore) -> entry.value
                else -> loadAndStore(key, entry, load)
            }
        } finally {
            entry.refreshing.set(false)
        }
    }

    private fun loadAndStore(key: Key, entry: Entry, load: () -> MoneyPool): MoneyPool {
        val answer = readFromBunq(key.teamId, load)
        if (answer == MoneyPool.Unavailable) {
            entry.retryNotBefore = clock.instant().plus(properties.retryAfter)
            return entry.value
        }
        entries.asMap().replace(key, entry, Entry(answer, clock.instant()))
        return answer
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
