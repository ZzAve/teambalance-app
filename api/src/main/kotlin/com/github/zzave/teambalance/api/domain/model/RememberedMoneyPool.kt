package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant

/** How long what Bunq answered for a money pool is trusted, as bound from `teambalance.bunq.read-cache.*`. */
data class MoneyPoolRetention(
    /** After this long a [MoneyPool.Connected] is shown as refreshing and Bunq is asked again. */
    val refresh: Duration,
    /** A [MoneyPool.Connected] is dropped this long after it was read. */
    val expire: Duration,
    /** After Bunq failed to answer, it is not asked again for this long. */
    val retryAfter: Duration,
)

/**
 * A [MoneyPool] with the moment Bunq was last read for it, and the rules for how long it is kept and when it is read again.
 * [retryNotBefore] is set when a reload found Bunq unavailable: no new attempt before then.
 */
data class RememberedMoneyPool(val value: MoneyPool, val readAt: Instant, val retryNotBefore: Instant? = null) {

    /**
     * How long this is kept from [now]; null for no limit. A [MoneyPool.Connected] is kept until [MoneyPoolRetention.expire]
     * after it was read, an [MoneyPool.Unavailable] for [MoneyPoolRetention.retryAfter], anything else, [MoneyPool.Rejected] included,
     * until it is evicted.
     */
    fun keptFor(now: Instant, retention: MoneyPoolRetention): Duration? =
        when (value) {
            is MoneyPool.Connected -> Duration.between(now, readAt.plus(retention.expire)).coerceAtLeast(Duration.ZERO)
            MoneyPool.Unavailable -> retention.retryAfter
            else -> null
        }

    /** A [MoneyPool.Rejected] stays so until the Admin connects again, so Bunq is not asked about it. */
    fun mayBeReloaded(): Boolean = value != MoneyPool.Rejected

    /** What is remembered after Bunq was asked again and [answer] came back. */
    fun reloaded(answer: MoneyPool, now: Instant, retention: MoneyPoolRetention): RememberedMoneyPool =
        if (answer == MoneyPool.Unavailable && value is MoneyPool.Connected) {
            RememberedMoneyPool(value, readAt, retryNotBefore = now.plus(retention.retryAfter))
        } else {
            readNow(answer, now)
        }

    /** What is remembered after asking Bunq again threw: the same as when Bunq is unavailable. */
    fun reloadFailed(now: Instant, retention: MoneyPoolRetention): RememberedMoneyPool =
        reloaded(MoneyPool.Unavailable, now, retention)

    /** True when an earlier reload found Bunq unavailable and the time to ask again has come. */
    fun retryIsDue(now: Instant): Boolean = retryNotBefore != null && !now.isBefore(retryNotBefore)

    /** True when a [MoneyPool.Connected] older than [MoneyPoolRetention.refresh] is being replaced, which is not while waiting to retry. */
    fun isRefreshing(now: Instant, retention: MoneyPoolRetention): Boolean {
        val notWaitingToRetry = retryNotBefore == null || retryIsDue(now)
        return value is MoneyPool.Connected && notWaitingToRetry && now.isAfter(readAt.plus(retention.refresh))
    }

    companion object {
        fun readNow(value: MoneyPool, now: Instant) = RememberedMoneyPool(value, now)
    }
}
