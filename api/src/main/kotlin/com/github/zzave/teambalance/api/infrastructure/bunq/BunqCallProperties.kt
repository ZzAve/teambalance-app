package com.github.zzave.teambalance.api.infrastructure.bunq

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

/** How the real adapter bounds its calls to Bunq, bound from `teambalance.bunq.*`. */
@ConfigurationProperties(prefix = "teambalance.bunq")
class BunqCallProperties(
    /** One call to Bunq, as far as the SDK is concerned. The SDK sets no timeout of its own. */
    val callTimeout: Duration,
    /** How long Bunq is left alone after a 429 whose message does not say. */
    val rateLimitPause: Duration,
    /** A pause is never shorter than this, whatever the 429 message says. */
    val rateLimitPauseMin: Duration,
    /** A pause is never longer than this, whatever the 429 message says. */
    val rateLimitPauseMax: Duration,
) {
    init {
        require(callTimeout.isPositive) { "teambalance.bunq.call-timeout ($callTimeout) must be positive" }
        require(rateLimitPauseMin.isPositive) { "teambalance.bunq.rate-limit-pause-min ($rateLimitPauseMin) must be positive" }
        require(rateLimitPauseMin <= rateLimitPauseMax) {
            "teambalance.bunq.rate-limit-pause-min ($rateLimitPauseMin) must not exceed rate-limit-pause-max ($rateLimitPauseMax)"
        }
        require(rateLimitPause in rateLimitPauseMin..rateLimitPauseMax) {
            "teambalance.bunq.rate-limit-pause ($rateLimitPause) must lie between rate-limit-pause-min and rate-limit-pause-max"
        }
    }
}
