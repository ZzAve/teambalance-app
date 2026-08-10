package com.github.zzave.teambalance.api.infrastructure.ratelimit

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.Duration

/**
 * Per-instance token-bucket store. Buckets are keyed by `policy|clientKey` and created lazily; the
 * injected [Clock] is the single time source so behaviour matches the rest of the app (Amsterdam zone)
 * and stays testable.
 *
 * The backing store is a Caffeine cache — the dependency the codebase already pulls in for caching —
 * bounded by [MAX_TRACKED_KEYS] and self-evicting after [EVICTION_WINDOW] of inactivity, so a flood of
 * distinct IPs or users can't grow it without bound. Eviction only drops idle keys (a bucket unused for
 * ten minutes has long since refilled to full), so it never weakens an active limit.
 */
@Component
class RateLimiter(
    private val clock: Clock,
) {
    private val buckets: Cache<String, TokenBucket> = Caffeine.newBuilder()
        .maximumSize(MAX_TRACKED_KEYS)
        .expireAfterAccess(EVICTION_WINDOW)
        .build()

    fun tryConsume(
        policyName: String,
        policy: RateLimitProperties.Policy,
        clientKey: String,
    ): TokenBucket.Consumption {
        val now = clock.millis()
        val bucket = buckets.get("$policyName|$clientKey") {
            TokenBucket(policy.capacity, policy.refillPeriod.toMillis(), now)
        }
        return bucket.tryConsume(now)
    }

    private companion object {
        const val MAX_TRACKED_KEYS = 100_000L
        val EVICTION_WINDOW: Duration = Duration.ofMinutes(10)
    }
}
