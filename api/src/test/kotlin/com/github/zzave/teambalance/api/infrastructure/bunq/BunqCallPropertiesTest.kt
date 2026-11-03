package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.string.shouldContain
import java.time.Duration

private fun seconds(n: Long) = Duration.ofSeconds(n)

class BunqCallPropertiesTest : FunSpec({

    test("a consistent set is accepted") {
        BunqCallProperties(seconds(5), seconds(30), seconds(1), seconds(60))
    }

    test("a timeout that is zero or negative is refused") {
        listOf(Duration.ZERO, seconds(-1)).forEach {
            shouldThrow<IllegalArgumentException> { BunqCallProperties(it, seconds(30), seconds(1), seconds(60)) }
                .message!! shouldContain "call-timeout"
        }
    }

    test("a minimum above the maximum is refused") {
        shouldThrow<IllegalArgumentException> { BunqCallProperties(seconds(5), seconds(30), seconds(61), seconds(60)) }
            .message!! shouldContain "rate-limit-pause-min"
    }

    test("a fallback pause outside the minimum and maximum is refused") {
        listOf(seconds(0), seconds(61)).forEach {
            shouldThrow<IllegalArgumentException> { BunqCallProperties(seconds(5), it, seconds(1), seconds(60)) }
                .message!! shouldContain "rate-limit-pause"
        }
    }
})
