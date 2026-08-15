package com.github.zzave.teambalance.api.infrastructure.ratelimit

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset

/** A hand-cranked clock so refill behaviour is asserted without sleeping. */
private class MutableClock(var now: Instant = Instant.EPOCH) : Clock() {
    override fun getZone(): ZoneId = ZoneOffset.UTC
    override fun withZone(zone: ZoneId?): Clock = this
    override fun instant(): Instant = now
    fun advance(duration: Duration) {
        now = now.plus(duration)
    }
}

class RateLimiterTest : FunSpec({

    val policy = RateLimitProperties.Policy(capacity = 2, refillPeriod = Duration.ofMinutes(1))

    test("distinct client keys get independent buckets") {
        val limiter = RateLimiter(MutableClock())

        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe false

        // A different caller still has a full allowance.
        limiter.tryConsume("p", policy, "ip:2.2.2.2").allowed shouldBe true
    }

    test("the same client key is separate across policies") {
        val limiter = RateLimiter(MutableClock())

        limiter.tryConsume("request", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("request", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("request", policy, "ip:1.1.1.1").allowed shouldBe false

        // Exhausting "request" must not spill into "verify" for the same IP.
        limiter.tryConsume("verify", policy, "ip:1.1.1.1").allowed shouldBe true
    }

    test("a bucket recovers after the refill window elapses") {
        val clock = MutableClock()
        val limiter = RateLimiter(clock)

        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe true
        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe false

        clock.advance(Duration.ofMinutes(1))
        limiter.tryConsume("p", policy, "ip:1.1.1.1").allowed shouldBe true
    }
})
