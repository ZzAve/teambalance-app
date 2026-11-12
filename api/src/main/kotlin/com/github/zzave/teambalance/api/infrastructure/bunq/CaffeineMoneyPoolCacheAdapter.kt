package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.benmanes.caffeine.cache.AsyncCacheLoader
import com.github.benmanes.caffeine.cache.AsyncLoadingCache
import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.Expiry
import com.github.zzave.teambalance.api.application.MoneyPoolReader
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executor
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

/**
 * Per-instance, in-memory [MoneyPoolCacheGateway] (ADR-0037 makes the same trade for the rate limiter).
 * Another instance holds its own entries, so after a connect, pick or disconnect handled elsewhere an
 * instance can show the old outcome until its value is refreshed, or expired at [BunqReadCacheProperties.expire].
 * A cached [MoneyPool.Rejected] has no time limit, so on another instance it lasts until that instance
 * restarts or one of its own connect, pick, disconnect or rejected list or pick evicts it.
 *
 * A Caffeine [AsyncLoadingCache]: [load] runs on [executor], never on the thread of the request, so it has
 * to set the tenant itself. It gets the tenant of the request that made the entry, which [tenantSchema]
 * reads at that moment and the key keeps. A read with nothing remembered waits for it. A read after
 * [BunqReadCacheProperties.refresh] returns the remembered value and Caffeine reloads the entry, once however
 * many readers there are. A reload that finds Bunq unavailable keeps the value with its age, so its expiry
 * keeps counting from the last successful read, and notes when Bunq may be asked again; [read] starts that
 * next reload, because Caffeine counts its refresh interval from the failed one.
 *
 * Caffeine drops the result of a load or reload whose entry was removed or replaced meanwhile, so an
 * [evict] during a read that is in flight is not undone by that read, which may have used the grant that
 * was just replaced.
 *
 * Bridges Caffeine's clock to the injected [Clock], as [com.github.zzave.teambalance.api.infrastructure.ratelimit.RateLimiter]
 * does for Bucket4j, so timing is deterministic under a test clock.
 */
@Component
class CaffeineMoneyPoolCacheAdapter(
    private val clock: Clock,
    private val properties: BunqReadCacheProperties,
    executor: Executor,
    private val tenantSchema: () -> SchemaName,
    private val load: (TenantRouting, BunqAccountId) -> MoneyPool,
) : MoneyPoolCacheGateway {

    /**
     * Bunq reads block on the network, so each one gets a virtual thread and none holds up a shared pool.
     * The money pool is read only in a request of a team, so a tenant is in effect whenever the cache is read.
     */
    @Autowired
    constructor(clock: Clock, properties: BunqReadCacheProperties, tenantScope: TenantScopeGateway, reader: MoneyPoolReader) : this(
        clock = clock,
        properties = properties,
        executor = Executors.newVirtualThreadPerTaskExecutor(),
        tenantSchema = { checkNotNull(tenantScope.current()) { "The money pool is read outside a tenant" }.schemaName },
        load = reader::read,
    )

    private data class Key(val tenant: TenantRouting, val account: BunqAccountId)

    /** [retryNotBefore] is set when a reload found Bunq unavailable; no new attempt before then. */
    private class Entry(val value: MoneyPool, val readAt: Instant, val retryNotBefore: Instant? = null)

    private val entries: AsyncLoadingCache<Key, Entry> = Caffeine.newBuilder()
        .maximumSize(MAX_ENTRIES)
        .executor(executor)
        .ticker { TimeUnit.MILLISECONDS.toNanos(clock.millis()) }
        .refreshAfterWrite(properties.refresh)
        .expireAfter(
            object : Expiry<Key, Entry> {
                override fun expireAfterCreate(key: Key, entry: Entry, currentTime: Long) = lifetimeNanos(entry)

                override fun expireAfterUpdate(key: Key, entry: Entry, currentTime: Long, currentDuration: Long) =
                    lifetimeNanos(entry)

                override fun expireAfterRead(key: Key, entry: Entry, currentTime: Long, currentDuration: Long) = currentDuration
            },
        )
        .buildAsync(
            object : AsyncCacheLoader<Key, Entry> {
                override fun asyncLoad(key: Key, executor: Executor): CompletableFuture<Entry> =
                    CompletableFuture.supplyAsync({ Entry(readFromBunq(key), clock.instant()) }, executor)

                override fun asyncReload(key: Key, old: Entry, executor: Executor): CompletableFuture<Entry> =
                    if (old.value == MoneyPool.Rejected) {
                        CompletableFuture.completedFuture(old)
                    } else {
                        CompletableFuture.supplyAsync({ reloaded(key, old) }, executor)
                    }
            },
        )

    override fun read(teamId: TeamId, account: BunqAccountId): CachedMoneyPool {
        val key = Key(TenantRouting(teamId, tenantSchema()), account)
        val entry = entries.synchronous().get(key)
        val now = clock.instant()
        val retryIsDue = entry.retryNotBefore?.let { !now.isBefore(it) }
        if (retryIsDue == true) entries.synchronous().refresh(key)
        val refreshing = entry.value is MoneyPool.Connected && retryIsDue != false && now.isAfter(entry.readAt.plus(properties.refresh))
        return CachedMoneyPool(entry.value, refreshing)
    }

    override fun evict(teamId: TeamId) {
        entries.asMap().keys.removeIf { it.tenant.teamId == teamId }
    }

    private fun reloaded(key: Key, old: Entry): Entry {
        val answer = readFromBunq(key)
        return if (answer == MoneyPool.Unavailable && old.value is MoneyPool.Connected) {
            Entry(old.value, old.readAt, retryNotBefore = clock.instant().plus(properties.retryAfter))
        } else {
            Entry(answer, clock.instant())
        }
    }

    private fun readFromBunq(key: Key): MoneyPool {
        log.debug("Reading the money pool from Bunq for team {}", key.tenant.teamId)
        return load(key.tenant, key.account)
    }

    /**
     * A value is remembered until [BunqReadCacheProperties.expire] after it was read, an Unavailable for the
     * retry interval, a Rejected for good.
     */
    private fun lifetimeNanos(entry: Entry): Long =
        when (entry.value) {
            is MoneyPool.Connected ->
                Duration.between(clock.instant(), entry.readAt.plus(properties.expire)).toNanos().coerceAtLeast(0)
            MoneyPool.Unavailable -> properties.retryAfter.toNanos()
            else -> Long.MAX_VALUE
        }

    private companion object {
        const val MAX_ENTRIES = 1_000L
        val log = LoggerFactory.getLogger(CaffeineMoneyPoolCacheAdapter::class.java)
    }
}
