package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Duration
import java.time.Instant

private val RETENTION =
    MoneyPoolRetention(refresh = Duration.ofSeconds(30), expire = Duration.ofMinutes(5), retryAfter = Duration.ofSeconds(60))
private val READ_AT = Instant.parse("2026-01-01T12:00:00Z")
private val CONNECTED: MoneyPool = MoneyPool.Connected(Money(1_000), emptyList())
private val OTHER_CONNECTED: MoneyPool = MoneyPool.Connected(Money(2_000), emptyList())

class RememberedMoneyPoolTest : FunSpec({

    context("how long it is kept") {
        test("a Connected is kept until the expire interval after it was read") {
            val remembered = RememberedMoneyPool(CONNECTED, READ_AT)

            remembered.keptFor(READ_AT, RETENTION) shouldBe Duration.ofMinutes(5)
            remembered.keptFor(READ_AT.plusSeconds(299), RETENTION) shouldBe Duration.ofSeconds(1)
            remembered.keptFor(READ_AT.plusSeconds(300), RETENTION) shouldBe Duration.ZERO
            remembered.keptFor(READ_AT.plusSeconds(301), RETENTION) shouldBe Duration.ZERO
        }

        test("a Connected kept after a failed reload still counts from the read that succeeded") {
            val kept = RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = READ_AT.plusSeconds(100))

            kept.keptFor(READ_AT.plusSeconds(200), RETENTION) shouldBe Duration.ofSeconds(100)
        }

        test("an Unavailable is kept for the retry interval, whatever its age") {
            val unavailable = RememberedMoneyPool(MoneyPool.Unavailable, READ_AT)

            unavailable.keptFor(READ_AT.plusSeconds(1_000), RETENTION) shouldBe Duration.ofSeconds(60)
        }

        test("anything else, Rejected included, is kept without a limit") {
            listOf(MoneyPool.Rejected, MoneyPool.Off, MoneyPool.NotConnected).forEach {
                RememberedMoneyPool(it, READ_AT).keptFor(READ_AT.plusSeconds(1_000_000), RETENTION) shouldBe null
            }
        }
    }

    context("whether it may be reloaded") {
        test("a Rejected may not") {
            RememberedMoneyPool(MoneyPool.Rejected, READ_AT).mayBeReloaded() shouldBe false
        }

        test("a Connected and an Unavailable may") {
            RememberedMoneyPool(CONNECTED, READ_AT).mayBeReloaded() shouldBe true
            RememberedMoneyPool(MoneyPool.Unavailable, READ_AT).mayBeReloaded() shouldBe true
        }
    }

    context("what is remembered after a reload") {
        val now = READ_AT.plusSeconds(40)

        test("a new answer is remembered as read now") {
            RememberedMoneyPool(CONNECTED, READ_AT).reloaded(OTHER_CONNECTED, now, RETENTION) shouldBe
                RememberedMoneyPool(OTHER_CONNECTED, now)
        }

        test("Unavailable over a Connected keeps the old value and its age, and sets when to try again") {
            RememberedMoneyPool(CONNECTED, READ_AT).reloaded(MoneyPool.Unavailable, now, RETENTION) shouldBe
                RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = now.plusSeconds(60))
        }

        test("Rejected over a Connected replaces it") {
            RememberedMoneyPool(CONNECTED, READ_AT).reloaded(MoneyPool.Rejected, now, RETENTION) shouldBe
                RememberedMoneyPool(MoneyPool.Rejected, now)
        }

        test("Unavailable over something that is not Connected is remembered as read now") {
            RememberedMoneyPool(MoneyPool.Unavailable, READ_AT).reloaded(MoneyPool.Unavailable, now, RETENTION) shouldBe
                RememberedMoneyPool(MoneyPool.Unavailable, now)
        }

        test("a Connected answer clears an earlier retry time") {
            RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = READ_AT.plusSeconds(100)).reloaded(OTHER_CONNECTED, now, RETENTION)
                .retryNotBefore shouldBe null
        }

        test("a reload that failed counts as Unavailable") {
            RememberedMoneyPool(CONNECTED, READ_AT).reloadFailed(now, RETENTION) shouldBe
                RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = now.plusSeconds(60))
        }
    }

    context("whether a retry is due") {
        val waiting = RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = READ_AT.plusSeconds(100))

        test("not while no retry is waiting") {
            RememberedMoneyPool(CONNECTED, READ_AT).retryIsDue(READ_AT.plusSeconds(1_000)) shouldBe false
        }

        test("not before the retry time, and from the retry time on") {
            waiting.retryIsDue(READ_AT.plusSeconds(99)) shouldBe false
            waiting.retryIsDue(READ_AT.plusSeconds(100)) shouldBe true
            waiting.retryIsDue(READ_AT.plusSeconds(101)) shouldBe true
        }
    }

    context("whether it is refreshing") {
        test("a Connected is refreshing only after the refresh interval has passed") {
            val remembered = RememberedMoneyPool(CONNECTED, READ_AT)

            remembered.isRefreshing(READ_AT.plusSeconds(30), RETENTION) shouldBe false
            remembered.isRefreshing(READ_AT.plusSeconds(31), RETENTION) shouldBe true
        }

        test("a Connected waiting for its retry time is not refreshing, and is again once the retry is due") {
            val waiting = RememberedMoneyPool(CONNECTED, READ_AT, retryNotBefore = READ_AT.plusSeconds(100))

            waiting.isRefreshing(READ_AT.plusSeconds(99), RETENTION) shouldBe false
            waiting.isRefreshing(READ_AT.plusSeconds(100), RETENTION) shouldBe true
        }

        test("anything that is not Connected is never refreshing") {
            listOf(MoneyPool.Unavailable, MoneyPool.Rejected).forEach {
                RememberedMoneyPool(it, READ_AT).isRefreshing(READ_AT.plusSeconds(1_000), RETENTION) shouldBe false
            }
        }
    }
})
