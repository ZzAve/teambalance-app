package com.github.zzave.teambalance.api.infrastructure.ratelimit

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.TimeMeter
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.Duration

/**
 * Per-instance rate-limit store. The token-bucket algorithm is Bucket4j's ([Bucket] with a greedy
 * refill); this class only owns the per-`policy|clientKey` bucket map and the wiring to the app's
 * time source. Buckets live in a Caffeine cache — the dependency the codebase already pulls in —
 * bounded by [MAX_TRACKED_KEYS] and self-evicting after [EVICTION_WINDOW] of inactivity, so a flood
 * of distinct IPs or users can't grow it without bound. Eviction only drops idle keys (a bucket
 * unused that long has long since refilled to full), so it never weakens an active limit.
 *
 * Bucket4j drives refill from its own [TimeMeter]; we bridge it to the injected [Clock] so timing
 * matches the rest of the app (Amsterdam zone) and stays deterministic under a test clock.
 */
@Component
class RateLimiter(clock: Clock) {

    data class Result(val allowed: Boolean, val retryAfterMillis: Long)

    private val timeMeter = object : TimeMeter {
        override fun currentTimeNanos(): Long = Duration.ofMillis(clock.millis()).toNanos()
        override fun isWallClockBased(): Boolean = true
    }

    private val buckets: Cache<String, Bucket> = Caffeine.newBuilder()
        .maximumSize(MAX_TRACKED_KEYS)
        .expireAfterAccess(EVICTION_WINDOW)
        .build()

    fun tryConsume(
        policyName: String,
        policy: RateLimitProperties.Policy,
        clientKey: String,
    ): Result {
        val bucket = buckets.get("$policyName|$clientKey") { newBucket(policy) }
        val probe = bucket.tryConsumeAndReturnRemaining(1)
        return Result(
            allowed = probe.isConsumed,
            retryAfterMillis = Duration.ofNanos(probe.nanosToWaitForRefill).toMillis(),
        )
    }

    private fun newBucket(policy: RateLimitProperties.Policy): Bucket {
        val limit = Bandwidth.builder()
            .capacity(policy.capacity)
            .refillGreedy(policy.capacity, policy.refillPeriod)
            .build()
        return Bucket.builder()
            .addLimit(limit)
            .withCustomTimePrecision(timeMeter)
            .build()
    }

    private companion object {
        const val MAX_TRACKED_KEYS = 100_000L
        val EVICTION_WINDOW: Duration = Duration.ofMinutes(10)
    }
}
