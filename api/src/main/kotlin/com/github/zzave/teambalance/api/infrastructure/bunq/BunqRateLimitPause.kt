package com.github.zzave.teambalance.api.infrastructure.bunq

import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Duration
import java.time.Instant

/**
 * Leaves Bunq alone after it answered 429, for the whole process and every endpoint (the buckets are per instance, ADR-0037).
 *
 * Bunq sends no `Retry-After` or rate-limit header (checked on a real sandbox 429), and the SDK does not hand response
 * headers to its caller. What a 429 does carry is its message: "You can do a maximum of 3 calls per 3 second to this
 * endpoint." The pause is that window, kept between the configured minimum and maximum. A message that says no usable
 * window gets the configured fallback.
 */
internal class BunqRateLimitPause(private val properties: BunqCallProperties, private val clock: Clock) {

    @Volatile
    private var pausedUntil: Instant = Instant.MIN

    /** Throws [BunqUnavailableException], without calling Bunq, while a pause is running. */
    fun requireOpen() {
        val remaining = Duration.between(clock.instant(), pausedUntil)
        if (remaining.isPositive) {
            throw BunqUnavailableException("Bunq is being left alone after a 429 for another ${remaining.toSeconds()}s")
        }
    }

    /** Starts a pause from a 429 response [responseBody]. A pause already running is never shortened. */
    @Synchronized
    fun startFrom(responseBody: String): Duration {
        val pause = pauseFor(responseBody)
        val now = clock.instant()
        val until = now.plus(pause)
        if (!pausedUntil.isAfter(now)) log.warn("Bunq answered 429, leaving it alone for {}", pause)
        if (until.isAfter(pausedUntil)) pausedUntil = until
        return pause
    }

    fun pauseFor(responseBody: String): Duration {
        val window = WINDOW.find(responseBody)?.groupValues?.get(1)?.toLongOrNull()?.takeIf { it > 0 }
        val pause = window?.let(Duration::ofSeconds) ?: properties.rateLimitPause
        return pause.coerceIn(properties.rateLimitPauseMin, properties.rateLimitPauseMax)
    }

    private companion object {
        val WINDOW = Regex("""\bper\s+(\d{1,9})\s+seconds?\b""", RegexOption.IGNORE_CASE)
        val log = LoggerFactory.getLogger(BunqRateLimitPause::class.java)
    }
}
