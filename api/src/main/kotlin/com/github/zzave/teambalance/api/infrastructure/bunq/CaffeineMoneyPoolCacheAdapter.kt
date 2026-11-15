package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.benmanes.caffeine.cache.AsyncCacheLoader
import com.github.benmanes.caffeine.cache.AsyncLoadingCache
import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.Expiry
import com.github.zzave.teambalance.api.application.MoneyPoolReader
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolRetention
import com.github.zzave.teambalance.api.domain.model.RememberedMoneyPool
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.Clock
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

    private val retention = MoneyPoolRetention(refresh = properties.refresh, expire = properties.expire, retryAfter = properties.retryAfter)

    private val entries: AsyncLoadingCache<Key, RememberedMoneyPool> = Caffeine.newBuilder()
        .maximumSize(MAX_ENTRIES)
        .executor(executor)
        .ticker { TimeUnit.MILLISECONDS.toNanos(clock.millis()) }
        .refreshAfterWrite(retention.refresh)
        .expireAfter(
            object : Expiry<Key, RememberedMoneyPool> {
                override fun expireAfterCreate(key: Key, entry: RememberedMoneyPool, currentTime: Long) = lifetimeNanos(entry)

                override fun expireAfterUpdate(key: Key, entry: RememberedMoneyPool, currentTime: Long, currentDuration: Long) =
                    lifetimeNanos(entry)

                override fun expireAfterRead(key: Key, entry: RememberedMoneyPool, currentTime: Long, currentDuration: Long) =
                    currentDuration
            },
        )
        .buildAsync(
            object : AsyncCacheLoader<Key, RememberedMoneyPool> {
                override fun asyncLoad(key: Key, executor: Executor): CompletableFuture<RememberedMoneyPool> =
                    CompletableFuture.supplyAsync({ RememberedMoneyPool.readNow(readFromBunq(key), clock.instant()) }, executor)

                override fun asyncReload(key: Key, old: RememberedMoneyPool, executor: Executor): CompletableFuture<RememberedMoneyPool> =
                    if (old.mayBeReloaded()) {
                        CompletableFuture.supplyAsync({ reloaded(key, old) }, executor)
                    } else {
                        CompletableFuture.completedFuture(old)
                    }
            },
        )

    override fun read(teamId: TeamId, account: BunqAccountId): CachedMoneyPool {
        val key = Key(TenantRouting(teamId, tenantSchema()), account)
        val entry = entries.synchronous().get(key)
        val now = clock.instant()
        if (entry.retryIsDue(now)) entries.synchronous().refresh(key)
        return CachedMoneyPool(entry.value, entry.isRefreshing(now, retention))
    }

    override fun evict(teamId: TeamId) {
        entries.asMap().keys.removeIf { it.tenant.teamId == teamId }
    }

    private fun reloaded(key: Key, old: RememberedMoneyPool): RememberedMoneyPool =
        runCatching { readFromBunq(key) }
            .map { old.reloaded(it, clock.instant(), retention) }
            .getOrElse {
                log.warn("Refreshing the money pool failed: {}", it.javaClass.simpleName)
                old.reloadFailed(clock.instant(), retention)
            }

    private fun readFromBunq(key: Key): MoneyPool {
        log.debug("Reading the money pool from Bunq for team {}", key.tenant.teamId)
        return load(key.tenant, key.account)
    }

    private fun lifetimeNanos(entry: RememberedMoneyPool): Long =
        entry.keptFor(clock.instant(), retention)?.toNanos() ?: Long.MAX_VALUE

    private companion object {
        const val MAX_ENTRIES = 1_000L
        val log = LoggerFactory.getLogger(CaffeineMoneyPoolCacheAdapter::class.java)
    }
}
