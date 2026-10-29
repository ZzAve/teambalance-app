package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.TeamId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
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

private fun balance(cents: Long): MoneyPool = MoneyPool.Connected(Money(cents), emptyList())

private val ALPHA = TeamId(UUID.randomUUID())
private val BETA = TeamId(UUID.randomUUID())
private val TEAMKAS = BunqAccountId("teamkas")
private val PRIVE = BunqAccountId("prive")
private val SECONDS_30 = Duration.ofSeconds(30)
private val SECONDS_10 = Duration.ofSeconds(10)
private val ALMOST = Duration.ofMillis(1)

class CaffeineMoneyPoolCacheAdapterTest : FunSpec({

    val clock = MutableClock()
    val cache = CaffeineMoneyPoolCacheAdapter(
        clock,
        BunqReadCacheProperties(refresh = SECONDS_30, expire = Duration.ofMinutes(5), retryAfter = SECONDS_10),
    )

    beforeTest {
        clock.now = Instant.EPOCH
        cache.invalidateAll()
    }

    fun read(bunq: Bunq, team: TeamId = ALPHA, account: BunqAccountId = TEAMKAS) = cache.read(team, account, bunq::load)

    test("asks Bunq on the first read and answers from memory until the refresh interval has passed") {
        val bunq = Bunq(balance(100))

        read(bunq) shouldBe balance(100)
        bunq.answer = balance(200)
        clock.advance(SECONDS_30.minus(ALMOST))

        read(bunq) shouldBe balance(100)
        bunq.loads shouldBe 1
    }

    test("asks Bunq again once the refresh interval has passed and serves the new value") {
        val bunq = Bunq(balance(100))
        read(bunq)
        bunq.answer = balance(200)
        clock.advance(SECONDS_30)

        read(bunq) shouldBe balance(200)

        bunq.loads shouldBe 2
        clock.advance(SECONDS_30.minus(ALMOST))
        read(bunq) shouldBe balance(200)
        bunq.loads shouldBe 2
    }

    test("a refresh that finds Bunq unavailable serves the last known value and does not ask again for the retry interval") {
        val bunq = Bunq(balance(100))
        read(bunq)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(SECONDS_30)

        read(bunq) shouldBe balance(100)
        bunq.loads shouldBe 2

        clock.advance(SECONDS_10.minus(ALMOST))
        read(bunq) shouldBe balance(100)
        bunq.loads shouldBe 2

        clock.advance(ALMOST)
        read(bunq) shouldBe balance(100)
        bunq.loads shouldBe 3
    }

    test("Bunq coming back after a failed refresh gives the new value and starts the age again") {
        val bunq = Bunq(balance(100))
        read(bunq)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(SECONDS_30)
        read(bunq)
        bunq.answer = balance(300)
        clock.advance(SECONDS_10)

        read(bunq) shouldBe balance(300)

        clock.advance(SECONDS_30.minus(ALMOST))
        read(bunq) shouldBe balance(300)
        bunq.loads shouldBe 3
    }

    test("keeps serving the last known value until it is 5 minutes old, then shows Unavailable") {
        val bunq = Bunq(balance(100))
        read(bunq)
        bunq.answer = MoneyPool.Unavailable
        clock.advance(SECONDS_30)
        read(bunq)

        clock.advance(Duration.ofMinutes(5).minus(SECONDS_30).minus(ALMOST))
        read(bunq) shouldBe balance(100)
        val loadsBeforeExpiry = bunq.loads

        clock.advance(ALMOST)
        read(bunq) shouldBe MoneyPool.Unavailable
        bunq.loads shouldBe loadsBeforeExpiry + 1
    }

    test("once the last known value is gone a failing Bunq is asked at most once per retry interval") {
        val bunq = Bunq(MoneyPool.Unavailable)

        read(bunq) shouldBe MoneyPool.Unavailable
        clock.advance(SECONDS_10.minus(ALMOST))
        read(bunq) shouldBe MoneyPool.Unavailable
        bunq.loads shouldBe 1

        clock.advance(ALMOST)
        read(bunq) shouldBe MoneyPool.Unavailable
        bunq.loads shouldBe 2
    }

    test("a cold read after Bunq failed recovers as soon as Bunq answers, once the retry interval has passed") {
        val bunq = Bunq(MoneyPool.Unavailable)
        read(bunq)
        bunq.answer = balance(100)
        clock.advance(SECONDS_10)

        read(bunq) shouldBe balance(100)
    }

    test("Rejected replaces a stale value, is served without asking Bunq and never times out") {
        val bunq = Bunq(balance(100))
        read(bunq)
        bunq.answer = MoneyPool.Rejected
        clock.advance(SECONDS_30)

        read(bunq) shouldBe MoneyPool.Rejected
        bunq.answer = balance(200)
        clock.advance(Duration.ofDays(1))

        read(bunq) shouldBe MoneyPool.Rejected
        bunq.loads shouldBe 2
    }

    test("a cold Rejected is served without asking Bunq again") {
        val bunq = Bunq(MoneyPool.Rejected)
        read(bunq)
        bunq.answer = balance(100)
        clock.advance(Duration.ofHours(1))

        read(bunq) shouldBe MoneyPool.Rejected
        bunq.loads shouldBe 1
    }

    test("evicting a team makes its next read ask Bunq, also after Rejected, and leaves other teams alone") {
        val alpha = Bunq(MoneyPool.Rejected)
        val beta = Bunq(balance(500))
        read(alpha, ALPHA)
        read(beta, BETA)
        alpha.answer = balance(100)

        cache.evict(ALPHA)

        read(alpha, ALPHA) shouldBe balance(100)
        read(beta, BETA) shouldBe balance(500)
        alpha.loads shouldBe 2
        beta.loads shouldBe 1
    }

    test("evicting a team forgets every account of it") {
        val teamkas = Bunq(balance(100))
        val prive = Bunq(balance(200))
        read(teamkas, ALPHA, TEAMKAS)
        read(prive, ALPHA, PRIVE)

        cache.evict(ALPHA)
        read(teamkas, ALPHA, TEAMKAS)
        read(prive, ALPHA, PRIVE)

        teamkas.loads shouldBe 2
        prive.loads shouldBe 2
    }

    test("teams and accounts have separate entries") {
        val alpha = Bunq(balance(100))
        val beta = Bunq(balance(200))
        val prive = Bunq(balance(300))

        read(alpha, ALPHA, TEAMKAS) shouldBe balance(100)
        read(beta, BETA, TEAMKAS) shouldBe balance(200)
        read(prive, ALPHA, PRIVE) shouldBe balance(300)

        read(alpha, ALPHA, TEAMKAS) shouldBe balance(100)
        alpha.loads shouldBe 1
    }

    test("readers of a cold entry wait for the one read that is on its way") {
        val entered = CountDownLatch(1)
        val release = CountDownLatch(1)
        val loads = AtomicInteger()
        val slow = {
            loads.incrementAndGet()
            entered.countDown()
            release.await(10, TimeUnit.SECONDS)
            balance(100)
        }
        val answers = java.util.concurrent.ConcurrentLinkedQueue<MoneyPool>()
        val first = thread { answers += cache.read(ALPHA, TEAMKAS, slow) }
        entered.await(10, TimeUnit.SECONDS)
        val second = thread { answers += cache.read(ALPHA, TEAMKAS, slow) }
        while (second.state == Thread.State.RUNNABLE || second.state == Thread.State.NEW) Thread.onSpinWait()

        release.countDown()
        first.join()
        second.join()

        loads.get() shouldBe 1
        answers.toList() shouldBe listOf(balance(100), balance(100))
    }

    test("while one reader refreshes a stale entry, another gets the stale value without a second Bunq call") {
        read(Bunq(balance(100)))
        clock.advance(SECONDS_30)
        val entered = CountDownLatch(1)
        val release = CountDownLatch(1)
        val loads = AtomicInteger()
        val slow = {
            loads.incrementAndGet()
            entered.countDown()
            release.await(10, TimeUnit.SECONDS)
            balance(200)
        }
        val refresher = thread { cache.read(ALPHA, TEAMKAS, slow) }
        entered.await(10, TimeUnit.SECONDS)

        val bunq = Bunq(balance(999))
        val whileRefreshing = read(bunq)
        release.countDown()
        refresher.join()

        whileRefreshing shouldBe balance(100)
        bunq.loads shouldBe 0
        loads.get() shouldBe 1
        read(bunq) shouldBe balance(200)
    }
})
