package com.github.zzave.teambalance.api.infrastructure.ratelimit

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.longs.shouldBeGreaterThan
import io.kotest.matchers.shouldBe

class TokenBucketTest : FunSpec({

    val minute = 60_000L

    test("allows up to capacity, then denies") {
        val bucket = TokenBucket(capacity = 3, refillPeriodMillis = minute, nowMillis = 0)

        bucket.tryConsume(0).allowed shouldBe true
        bucket.tryConsume(0).allowed shouldBe true
        bucket.tryConsume(0).allowed shouldBe true
        bucket.tryConsume(0).allowed shouldBe false
    }

    test("a denial reports a positive retry-after") {
        val bucket = TokenBucket(capacity = 1, refillPeriodMillis = minute, nowMillis = 0)
        bucket.tryConsume(0).allowed shouldBe true

        val denied = bucket.tryConsume(0)
        denied.allowed shouldBe false
        // 1 token / 60s ⇒ next token is 60s out.
        denied.retryAfterMillis shouldBe minute
    }

    test("refills continuously — one token becomes available part-way through the period") {
        val bucket = TokenBucket(capacity = 5, refillPeriodMillis = minute, nowMillis = 0)
        repeat(5) { bucket.tryConsume(0).allowed shouldBe true }
        bucket.tryConsume(0).allowed shouldBe false

        // 5 tokens/min ⇒ one token every 12s. At +11s still empty, at +12s one is back.
        bucket.tryConsume(11_000).allowed shouldBe false
        bucket.tryConsume(12_000).allowed shouldBe true
        // ...and only one — the second consume in the same instant is denied again.
        bucket.tryConsume(12_000).allowed shouldBe false
    }

    test("refill is capped at capacity — idle time does not bank extra tokens") {
        val bucket = TokenBucket(capacity = 2, refillPeriodMillis = minute, nowMillis = 0)
        bucket.tryConsume(0).allowed shouldBe true
        bucket.tryConsume(0).allowed shouldBe true

        // Idle for an hour: refills to the 2-token cap, not 120.
        bucket.tryConsume(3_600_000).allowed shouldBe true
        bucket.tryConsume(3_600_000).allowed shouldBe true
        bucket.tryConsume(3_600_000).allowed shouldBe false
    }

    test("retry-after shrinks as the bucket partially refills") {
        val bucket = TokenBucket(capacity = 1, refillPeriodMillis = minute, nowMillis = 0)
        bucket.tryConsume(0).allowed shouldBe true

        val early = bucket.tryConsume(0).retryAfterMillis
        val later = bucket.tryConsume(30_000).retryAfterMillis
        early shouldBeGreaterThan later
    }
})
