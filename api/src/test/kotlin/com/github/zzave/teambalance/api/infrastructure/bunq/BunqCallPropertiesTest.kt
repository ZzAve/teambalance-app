package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.string.shouldContain
import java.time.Duration

private fun seconds(n: Long) = Duration.ofSeconds(n)

private fun properties(
    call: Duration = seconds(5),
    setup: Duration = seconds(15),
    pause: Duration = seconds(30),
    min: Duration = seconds(1),
    max: Duration = seconds(60),
) = BunqCallProperties(call, setup, pause, min, max)

class BunqCallPropertiesTest : FunSpec({

    test("a consistent set is accepted") {
        properties()
    }

    test("a timeout that is zero or negative is refused") {
        listOf(Duration.ZERO, seconds(-1)).forEach {
            shouldThrow<IllegalArgumentException> { properties(call = it) }.message!! shouldContain "call-timeout"
        }
    }

    test("a setup timeout that is zero or negative is refused") {
        listOf(Duration.ZERO, seconds(-1)).forEach {
            shouldThrow<IllegalArgumentException> { properties(setup = it) }.message!! shouldContain "setup-timeout"
        }
    }

    test("a minimum above the maximum is refused") {
        shouldThrow<IllegalArgumentException> { properties(min = seconds(61)) }.message!! shouldContain "rate-limit-pause-min"
    }

    test("a fallback pause outside the minimum and maximum is refused") {
        listOf(seconds(0), seconds(61)).forEach {
            shouldThrow<IllegalArgumentException> { properties(pause = it) }.message!! shouldContain "rate-limit-pause"
        }
    }
})
