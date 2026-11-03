package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset

private val FALLBACK = Duration.ofSeconds(30)
private val MIN = Duration.ofSeconds(2)
private val MAX = Duration.ofSeconds(45)
private const val REAL_429 =
    """{"Error":[{"error_description":"Too many requests. You can do a maximum of 3 calls per 3 second to this endpoint.","error_description_translated":"Too many requests. You can do a maximum of 3 calls per 3 second to this endpoint."}]}"""

private class PauseTestClock(var now: Instant) : Clock() {
    override fun getZone() = ZoneOffset.UTC
    override fun withZone(zone: java.time.ZoneId) = this
    override fun instant() = now
}

private fun bodySaying(message: String) = """{"Error":[{"error_description":"$message"}]}"""

class BunqRateLimitPauseTest : FunSpec({

    val clock = PauseTestClock(Instant.parse("2026-11-03T12:00:00Z"))
    fun pause() = BunqRateLimitPause(BunqCallProperties(Duration.ofSeconds(5), FALLBACK, MIN, MAX), clock)

    context("how long a 429 pauses") {
        test("the real sandbox message, which says '3 second', gives 3 seconds") {
            pause().pauseFor(REAL_429) shouldBe Duration.ofSeconds(3)
        }

        test("a plural 'seconds' is read too") {
            val body = bodySaying("You can do a maximum of 70 calls per 30 seconds to this endpoint.")
            pause().pauseFor(body) shouldBe Duration.ofSeconds(30)
        }

        test("a window shorter than the minimum is raised to the minimum") {
            pause().pauseFor(bodySaying("a maximum of 1 calls per 1 second")) shouldBe MIN
        }

        test("a window longer than the maximum is cut to the maximum") {
            pause().pauseFor(bodySaying("a maximum of 1 calls per 3600 seconds")) shouldBe MAX
        }

        test("a message without a window gives the configured fallback") {
            pause().pauseFor(bodySaying("Too many requests.")) shouldBe FALLBACK
        }

        listOf(
            "empty" to "",
            "not json" to "<html>429</html>",
            "zero window" to bodySaying("a maximum of 3 calls per 0 seconds"),
            "number too long to be real" to bodySaying("a maximum of 3 calls per 99999999999999999999 seconds"),
            "no digits" to bodySaying("a maximum of 3 calls per few seconds"),
        ).forEach { (name, body) ->
            test("$name gives the fallback and does not throw") {
                shouldNotThrowAny { pause().pauseFor(body) } shouldBe FALLBACK
            }
        }
    }

    context("the pause itself") {
        test("nothing is paused before a 429") {
            shouldNotThrowAny { pause().requireOpen() }
        }

        test("after a 429 every call is refused without asking Bunq, until the pause has passed") {
            val pause = pause()
            clock.now = Instant.parse("2026-11-03T12:00:00Z")
            pause.startFrom(REAL_429) shouldBe Duration.ofSeconds(3)

            shouldThrow<BunqUnavailableException> { pause.requireOpen() }
            clock.now = Instant.parse("2026-11-03T12:00:02.999Z")
            shouldThrow<BunqUnavailableException> { pause.requireOpen() }
            clock.now = Instant.parse("2026-11-03T12:00:03Z")
            shouldNotThrowAny { pause.requireOpen() }
        }

        test("a second 429 during a pause does not shorten it") {
            val pause = pause()
            clock.now = Instant.parse("2026-11-03T12:00:00Z")
            pause.startFrom(bodySaying("a maximum of 1 calls per 40 seconds"))
            clock.now = Instant.parse("2026-11-03T12:00:10Z")
            pause.startFrom(REAL_429)

            clock.now = Instant.parse("2026-11-03T12:00:39Z")
            shouldThrow<BunqUnavailableException> { pause.requireOpen() }
            clock.now = Instant.parse("2026-11-03T12:00:40Z")
            shouldNotThrowAny { pause.requireOpen() }
        }

        test("the refusal says how long is left and carries nothing from the response") {
            val pause = pause()
            clock.now = Instant.parse("2026-11-03T12:00:00Z")
            pause.startFrom(bodySaying("secret-looking-text a maximum of 1 calls per 20 seconds"))

            val message = shouldThrow<BunqUnavailableException> { pause.requireOpen() }.message!!
            message shouldBe "Bunq is being left alone after a 429 for another 20s"
        }
    }
})
