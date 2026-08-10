package com.github.zzave.teambalance.api.infrastructure.ratelimit

import kotlin.math.ceil

/**
 * A single-key token bucket. Deliberately not tied to a wall clock: every operation takes an explicit
 * `nowMillis`, so the caller ([RateLimiter]) owns the time source (the injected [java.time.Clock]) and
 * the algorithm stays deterministically unit-testable without sleeps.
 *
 * Refill is continuous and lazy: the bucket regains `capacity` tokens over one `refillPeriodMillis`
 * (i.e. `capacity / refillPeriodMillis` tokens per millisecond), replenished on access rather than by
 * a background timer. Fractional tokens are tracked so spacing finer than one `refillPeriod` is honoured
 * — e.g. a 5-per-minute bucket hands back one token every ~12s, not five all at once each minute.
 */
class TokenBucket(
    private val capacity: Long,
    private val refillPeriodMillis: Long,
    nowMillis: Long,
) {
    init {
        require(capacity > 0) { "capacity must be positive, was $capacity" }
        require(refillPeriodMillis > 0) { "refillPeriodMillis must be positive, was $refillPeriodMillis" }
    }

    private var tokens: Double = capacity.toDouble()
    private var lastRefillMillis: Long = nowMillis

    data class Consumption(val allowed: Boolean, val retryAfterMillis: Long)

    /**
     * Attempt to spend one token. On success the bucket is debited and [Consumption.allowed] is true.
     * On failure nothing is debited and [Consumption.retryAfterMillis] is the wait until the next token
     * refills (always ≥ 1ms so callers can advertise a non-zero `Retry-After`).
     */
    @Synchronized
    fun tryConsume(nowMillis: Long): Consumption {
        refill(nowMillis)
        if (tokens >= 1.0) {
            tokens -= 1.0
            return Consumption(allowed = true, retryAfterMillis = 0)
        }
        val tokensNeeded = 1.0 - tokens
        val retryAfter = ceil(tokensNeeded / tokensPerMilli()).toLong().coerceAtLeast(1)
        return Consumption(allowed = false, retryAfterMillis = retryAfter)
    }

    private fun refill(nowMillis: Long) {
        if (nowMillis <= lastRefillMillis) return
        val elapsed = nowMillis - lastRefillMillis
        tokens = (tokens + elapsed * tokensPerMilli()).coerceAtMost(capacity.toDouble())
        lastRefillMillis = nowMillis
    }

    private fun tokensPerMilli(): Double = capacity.toDouble() / refillPeriodMillis
}
