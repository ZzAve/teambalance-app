package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.UUID
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executor
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference
import kotlin.concurrent.thread

/** A hand-cranked clock so expiry is asserted without sleeping. */
private class MutableClock(var now: Instant = Instant.EPOCH) : Clock() {
    override fun getZone(): ZoneId = ZoneOffset.UTC
    override fun withZone(zone: ZoneId?): Clock = this
    override fun instant(): Instant = now
    fun advance(duration: Duration) {
        now = now.plus(duration)
    }
}

/** Stands in for Bunq: answers [answer] and counts how often it was asked. */
private class Bunq(var answer: MoneyPool) {
    private val asked = AtomicInteger()
    val loads get() = asked.get()

    fun load(): MoneyPool {
        asked.incrementAndGet()
        return answer
    }
}

/** A Bunq that holds every read until [release], so a test can do something while a read is in flight. */
private class SlowBunq(private val answer: MoneyPool) {
    val entered = CountDownLatch(1)
    val release = CountDownLatch(1)
    private val asked = AtomicInteger()
    val loads get() = asked.get()

    fun load(): MoneyPool {
        asked.incrementAndGet()
        entered.countDown()
        release.await(10, TimeUnit.SECONDS)
        return answer
    }
}

/** Daemon, so a failed assertion cannot keep the JVM alive; the tests release and join in a finally. */
private fun reader(block: () -> Unit) = thread(isDaemon = true, block = block)

/** True once [thread] waits inside Caffeine's compute for a read that is on its way, within 5 seconds. */
private fun waitsInsideCaffeine(thread: Thread): Boolean {
    val deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(5)
    while (System.nanoTime() < deadline) {
        val waiting = thread.state in setOf(Thread.State.BLOCKED, Thread.State.WAITING, Thread.State.TIMED_WAITING)
        if (waiting && thread.stackTrace.any { it.className.startsWith("com.github.benmanes.caffeine") }) return true
        Thread.onSpinWait()
    }
    return false
}

private fun balance(cents: Long): MoneyPool = MoneyPool.Connected(Money(cents), emptyList())

private val ALPHA = TeamId(UUID.randomUUID())
private val BETA = TeamId(UUID.randomUUID())
private val TEAMKAS = BunqAccountId("teamkas")
private val PRIVE = BunqAccountId("prive")
private val SECONDS_30 = Duration.ofSeconds(30)
private val SECONDS_10 = Duration.ofSeconds(10)
private val ALMOST = Duration.ofMillis(1)
private val PAST_REFRESH = SECONDS_30.plus(ALMOST)

/**
 * Runs a load on the thread that asks for it, except while [holding]: then the work waits for [release].
 * A test holds the work to see what a read returns before its background refresh has run.
 */
private class HeldExecutor : Executor {
    private val held = ConcurrentLinkedQueue<Runnable>()

    @Volatile
    var holding = false

    override fun execute(command: Runnable) {
        if (holding) held += command else command.run()
    }

    fun release() {
        holding = false
        while (true) (held.poll() ?: break).run()
    }
}

private fun fresh(pool: MoneyPool) = CachedMoneyPool(pool, refreshing = false)
private fun refreshing(pool: MoneyPool) = CachedMoneyPool(pool, refreshing = true)

/** True once [condition] holds, within 5 seconds. */
private fun within5Seconds(condition: () -> Boolean): Boolean {
    val deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(5)
    while (System.nanoTime() < deadline) {
        if (condition()) return true
        Thread.sleep(5)
    }
    return condition()
}

class CaffeineMoneyPoolCacheAdapterTest : FunSpec({

    val clock = MutableClock()
    val threads = Executors.newCachedThreadPool { runnable -> Thread(runnable).apply { isDaemon = true } }

    val background = HeldExecutor()
    val tenantsRead = ConcurrentLinkedQueue<TenantRouting>()

    beforeTest {
        clock.now = Instant.EPOCH
        tenantsRead.clear()
    }
    afterSpec { threads.shutdownNow() }

    fun cache(executor: Executor = background, load: (TeamId, BunqAccountId) -> MoneyPool) =
        CaffeineMoneyPoolCacheAdapter(
            clock,
            BunqReadCacheProperties(refresh = SECONDS_30, expire = Duration.ofMinutes(5), retryAfter = SECONDS_10),
            executor,
            tenantSchema = { SchemaName("team_alpha") },
        ) { tenant, account ->
            tenantsRead += tenant
            load(tenant.teamId, account)
        }

    fun cacheOver(bunq: Bunq) = cache { _, _ -> bunq.load() }

    /** What a read of ALPHA's TEAMKAS returns before the background work it started has run; that work runs afterwards. */
    fun CaffeineMoneyPoolCacheAdapter.readBeforeBackgroundWork(): CachedMoneyPool {
        background.holding = true
        return read(ALPHA, TEAMKAS).also { background.release() }
    }

    /**
     * A cache that holds [first] for ALPHA's TEAMKAS and asks [then] from the next load on, on other threads.
     * The first load runs on the calling thread: Caffeine notes the time of a load in a callback of that load, and
     * on another thread that callback can still be on its way when the test moves the clock.
     */
    fun staleCacheThatReloadsFrom(first: MoneyPool, then: () -> MoneyPool): CaffeineMoneyPoolCacheAdapter {
        var load: () -> MoneyPool = { first }
        var executor: Executor = background
        val cache = cache({ executor.execute(it) }) { _, _ -> load() }
        cache.read(ALPHA, TEAMKAS)
        executor = threads
        load = then
        clock.advance(PAST_REFRESH)
        return cache
    }

    test("asks Bunq on the first read and answers from memory until the refresh interval has passed") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(100))
        bunq.answer = balance(200)
        clock.advance(SECONDS_30.minus(ALMOST))

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(100))
        bunq.loads shouldBe 1
    }

    test("a read after the refresh interval gets the last known value, marked as refreshing, and the next read gets the new one") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = balance(200)
        clock.advance(PAST_REFRESH)

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(200))

        bunq.loads shouldBe 2
        clock.advance(SECONDS_30.minus(ALMOST))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(200))
        bunq.loads shouldBe 2
    }

    test("the first load and a refresh both get the team with the schema of the request that read") {
        val cache = cacheOver(Bunq(balance(100)))
        cache.read(ALPHA, TEAMKAS)
        clock.advance(PAST_REFRESH)

        cache.readBeforeBackgroundWork()

        tenantsRead.toList() shouldBe List(2) { TenantRouting(ALPHA, SchemaName("team_alpha")) }
    }

    test("a read after the refresh interval does not wait for Bunq") {
        val slow = SlowBunq(balance(200))
        val cache = staleCacheThatReloadsFrom(balance(100), slow::load)
        try {
            cache.read(ALPHA, TEAMKAS) shouldBe refreshing(balance(100))
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true
        } finally {
            slow.release.countDown()
        }

        within5Seconds { cache.read(ALPHA, TEAMKAS) == fresh(balance(200)) } shouldBe true
        slow.loads shouldBe 1
    }

    test("a refresh that finds Bunq unavailable keeps the last known value and does not ask again for the retry interval") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(PAST_REFRESH)

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        bunq.loads shouldBe 2

        clock.advance(SECONDS_10.minus(ALMOST))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(100))
        bunq.loads shouldBe 2

        clock.advance(ALMOST)
        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        bunq.loads shouldBe 3
    }

    test("Bunq coming back after a failed refresh gives the new value and starts the age again") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(PAST_REFRESH)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = balance(300)
        clock.advance(SECONDS_10)

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))

        clock.advance(SECONDS_30.minus(ALMOST))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))
        bunq.loads shouldBe 3
    }

    test("keeps serving the last known value until it is 5 minutes old, then shows Unavailable") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(PAST_REFRESH)
        cache.read(ALPHA, TEAMKAS)

        clock.advance(Duration.ofMinutes(5).minus(PAST_REFRESH).minus(ALMOST))
        cache.read(ALPHA, TEAMKAS).pool shouldBe balance(100)
        val loadsBeforeExpiry = bunq.loads

        clock.advance(ALMOST)
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Unavailable)
        bunq.loads shouldBe loadsBeforeExpiry + 1
    }

    test("once the last known value is gone a failing Bunq is asked at most once per retry interval") {
        val bunq = Bunq(MoneyPool.Unavailable)
        val cache = cacheOver(bunq)

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Unavailable)
        clock.advance(SECONDS_10.minus(ALMOST))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Unavailable)
        bunq.loads shouldBe 1

        clock.advance(ALMOST)
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Unavailable)
        bunq.loads shouldBe 2
    }

    test("a cold read after Bunq failed recovers as soon as Bunq answers, once the retry interval has passed") {
        val bunq = Bunq(MoneyPool.Unavailable)
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = balance(100)
        clock.advance(SECONDS_10)

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(100))
    }

    test("Rejected replaces a stale value, is served without asking Bunq and never times out") {
        val bunq = Bunq(balance(100))
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = MoneyPool.Rejected
        clock.advance(PAST_REFRESH)

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Rejected)
        bunq.answer = balance(200)
        clock.advance(Duration.ofDays(1))

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Rejected)
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Rejected)
        bunq.loads shouldBe 2
    }

    test("a cold Rejected is served without asking Bunq again") {
        val bunq = Bunq(MoneyPool.Rejected)
        val cache = cacheOver(bunq)
        cache.read(ALPHA, TEAMKAS)
        bunq.answer = balance(100)
        clock.advance(Duration.ofHours(1))

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Rejected)
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(MoneyPool.Rejected)
        bunq.loads shouldBe 1
    }

    test("asks for the team and account that were read, and keeps them apart") {
        val bunqs = mapOf(
            (ALPHA to TEAMKAS) to Bunq(balance(100)),
            (BETA to TEAMKAS) to Bunq(balance(200)),
            (ALPHA to PRIVE) to Bunq(balance(300)),
        )
        val cache = cache { team, account -> bunqs.getValue(team to account).load() }

        cache.read(ALPHA, TEAMKAS).pool shouldBe balance(100)
        cache.read(BETA, TEAMKAS).pool shouldBe balance(200)
        cache.read(ALPHA, PRIVE).pool shouldBe balance(300)

        cache.read(ALPHA, TEAMKAS).pool shouldBe balance(100)
        bunqs.values.map { it.loads } shouldBe listOf(1, 1, 1)
    }

    test("evicting a team makes its next read ask Bunq, also after Rejected, and leaves other teams alone") {
        val alpha = Bunq(MoneyPool.Rejected)
        val beta = Bunq(balance(500))
        val cache = cache { team, _ -> (if (team == ALPHA) alpha else beta).load() }
        cache.read(ALPHA, TEAMKAS)
        cache.read(BETA, TEAMKAS)
        alpha.answer = balance(100)

        cache.evict(ALPHA)

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(100))
        cache.read(BETA, TEAMKAS) shouldBe fresh(balance(500))
        alpha.loads shouldBe 2
        beta.loads shouldBe 1
    }

    test("evicting a team forgets every account of it") {
        val teamkas = Bunq(balance(100))
        val prive = Bunq(balance(200))
        val cache = cache { _, account -> (if (account == TEAMKAS) teamkas else prive).load() }
        cache.read(ALPHA, TEAMKAS)
        cache.read(ALPHA, PRIVE)

        cache.evict(ALPHA)
        cache.read(ALPHA, TEAMKAS)
        cache.read(ALPHA, PRIVE)

        teamkas.loads shouldBe 2
        prive.loads shouldBe 2
    }

    test("readers of a cold entry wait for the one read that is on its way") {
        val slow = SlowBunq(balance(100))
        val cache = cache(threads) { _, _ -> slow.load() }
        val answers = ConcurrentLinkedQueue<MoneyPool>()
        val secondAboutToRead = CountDownLatch(1)
        val first = reader { answers += cache.read(ALPHA, TEAMKAS).pool }
        val second = thread(start = false, isDaemon = true) {
            secondAboutToRead.countDown()
            answers += cache.read(ALPHA, TEAMKAS).pool
        }
        try {
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true
            second.start()
            secondAboutToRead.await(5, TimeUnit.SECONDS) shouldBe true
            waitsInsideCaffeine(second) shouldBe true
            slow.loads shouldBe 1
        } finally {
            slow.release.countDown()
            first.join(10_000)
            second.join(10_000)
        }

        slow.loads shouldBe 1
        answers.toList() shouldBe listOf(balance(100), balance(100))
    }

    test("while a refresh is on its way, more reads get the last known value without a second Bunq call") {
        val slow = SlowBunq(balance(200))
        val cache = staleCacheThatReloadsFrom(balance(100), slow::load)
        try {
            cache.read(ALPHA, TEAMKAS)
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true

            cache.read(ALPHA, TEAMKAS) shouldBe refreshing(balance(100))
            cache.read(ALPHA, TEAMKAS) shouldBe refreshing(balance(100))
        } finally {
            slow.release.countDown()
        }

        within5Seconds { cache.read(ALPHA, TEAMKAS) == fresh(balance(200)) } shouldBe true
        slow.loads shouldBe 1
    }

    test("an evict while a cold read is in flight keeps that read's result out of the cache") {
        val slow = SlowBunq(balance(100))
        var load: () -> MoneyPool = slow::load
        val cache = cache(threads) { _, _ -> load() }
        val answer = AtomicReference<MoneyPool>()
        val reader = reader { answer.set(cache.read(ALPHA, TEAMKAS).pool) }
        try {
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true
            cache.evict(ALPHA)
        } finally {
            slow.release.countDown()
            reader.join(10_000)
        }
        val fresh = Bunq(balance(200))
        load = fresh::load

        answer.get() shouldBe balance(100)
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(200))
        fresh.loads shouldBe 1
    }

    test("an evict while a refresh is in flight keeps the refresh's result out of the cache") {
        val slow = SlowBunq(balance(200))
        val fresh = Bunq(balance(300))
        var reload: () -> MoneyPool = slow::load
        val cache = staleCacheThatReloadsFrom(balance(100)) { reload() }
        val finished = CountDownLatch(1)
        reload = { slow.load().also { finished.countDown() } }
        try {
            cache.read(ALPHA, TEAMKAS)
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true
            cache.evict(ALPHA)
        } finally {
            slow.release.countDown()
        }
        finished.await(10, TimeUnit.SECONDS) shouldBe true
        reload = fresh::load

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))
        fresh.loads shouldBe 1
    }

    test("a refresh that finishes late does not overwrite the entry a newer read loaded meanwhile") {
        val slow = SlowBunq(balance(200))
        val newer = Bunq(balance(300))
        var reload: () -> MoneyPool = slow::load
        val cache = staleCacheThatReloadsFrom(balance(100)) { reload() }
        val finished = CountDownLatch(1)
        reload = { slow.load().also { finished.countDown() } }
        try {
            cache.read(ALPHA, TEAMKAS)
            slow.entered.await(10, TimeUnit.SECONDS) shouldBe true
            reload = newer::load
            clock.advance(Duration.ofMinutes(5))
            cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))
        } finally {
            slow.release.countDown()
        }
        finished.await(10, TimeUnit.SECONDS) shouldBe true

        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(300))
        newer.loads shouldBe 1
    }

    test("a refresh whose load throws keeps the last known value, and the next read asks Bunq again") {
        val bunq = Bunq(balance(100))
        var load: () -> MoneyPool = bunq::load
        val cache = cache { _, _ -> load() }
        cache.read(ALPHA, TEAMKAS)
        clock.advance(PAST_REFRESH)
        load = { error("boom") }

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        bunq.answer = balance(200)
        load = bunq::load

        cache.readBeforeBackgroundWork() shouldBe refreshing(balance(100))
        cache.read(ALPHA, TEAMKAS) shouldBe fresh(balance(200))
    }
})
