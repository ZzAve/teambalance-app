package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import java.time.Duration

private val SECONDS_10 = Duration.ofSeconds(10)

class BunqReadCachePropertiesTest : FunSpec({

    test("refreshing as late as expiring is allowed") {
        BunqReadCacheProperties(refresh = Duration.ofMinutes(5), expire = Duration.ofMinutes(5), retryAfter = SECONDS_10)
    }

    test("refreshing later than expiring is refused") {
        shouldThrow<IllegalArgumentException> {
            BunqReadCacheProperties(refresh = Duration.ofMinutes(6), expire = Duration.ofMinutes(5), retryAfter = SECONDS_10)
        }
    }
})
