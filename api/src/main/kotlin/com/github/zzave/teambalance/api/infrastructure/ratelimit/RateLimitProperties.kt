package com.github.zzave.teambalance.api.infrastructure.ratelimit

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

/**
 * Rate-limit configuration, bound from `teambalance.rate-limit.*`. One [Policy] per throttled
 * endpoint group so limits are tuned independently and read straight out of `application.yml`.
 *
 * Defaults are conservative for the pre-auth surface (a human clicking "email me a link" rarely
 * needs more than a handful of tries a minute) and looser for the authenticated `accept` path.
 * See ADR-0037 for why this is an in-memory, per-instance limiter rather than a Redis-backed one.
 */
@ConfigurationProperties(prefix = "teambalance.rate-limit")
data class RateLimitProperties(
    /** Master switch. When false the filter is a straight pass-through (no bucket lookups). */
    val enabled: Boolean = true,
    /**
     * Trust the left-most `X-Forwarded-For` entry as the client IP. True in prod, where the API sits
     * behind Scaleway's edge which sets the header; the socket `remoteAddr` there is the platform proxy,
     * not the caller. XFF is caller-spoofable, so per-IP limits are a coarse backstop — the per-user
     * limit on `accept` is the sharper control. Set false anywhere the app is directly internet-facing.
     */
    val trustForwardedFor: Boolean = true,
    /** `POST /api/auth/magic-link/request` — keyed per client IP. */
    val magicLinkRequest: Policy = Policy(capacity = 5, refillPeriod = Duration.ofMinutes(1)),
    /** `POST /api/auth/magic-link/verify` — keyed per client IP. */
    val magicLinkVerify: Policy = Policy(capacity = 10, refillPeriod = Duration.ofMinutes(1)),
    /** `POST /api/invitations/{token}/accept` — keyed per authenticated user, falling back to IP. */
    val invitationAccept: Policy = Policy(capacity = 10, refillPeriod = Duration.ofMinutes(1)),
    /**
     * `GET /api/calendar/{slug}/{token}.ics` — keyed per **token**, not per IP. The feed is
     * session-less, so there is no user to key on, and a whole club behind one office NAT would share
     * an IP bucket and throttle each other. The token is the subscription's identity, which is exactly
     * the thing worth bounding: 30/hour still leaves thirty times the headroom over the tightest
     * cadence the feed advertises (hourly, and only in the twelve hours before an event — see
     * `RefreshCadence`), while being tight enough that the URL is not a free bulk-read endpoint.
     */
    val calendarFeed: Policy = Policy(capacity = 30, refillPeriod = Duration.ofHours(1)),
    /**
     * `GET /api/calendar/{slug}/{token}.ics` — the second ceiling on the same request, keyed per
     * client IP, because [calendarFeed] alone bounds a *subscription* and not a *host*: the token is
     * caller-supplied, so varying it hands out a fresh per-token bucket every time.
     *
     * Deliberately loose. A whole club behind one office NAT shares this bucket, and the feed itself
     * only asks to be polled between twice and twenty-four times a day — so even fifty members on one
     * address sit around 50/hour at the tightest cadence, an order of magnitude under this. It is
     * not here to shape honest traffic; it is here so an unauthenticated endpoint that does three
     * indexed queries cannot be driven without limit, and so the bucket store cannot be churned past
     * its key cap from one source.
     */
    val calendarFeedPerClient: Policy = Policy(capacity = 600, refillPeriod = Duration.ofHours(1)),
) {
    /** A token-bucket allowance: `capacity` requests, fully replenished once per `refillPeriod`. */
    data class Policy(
        val capacity: Long,
        val refillPeriod: Duration,
    )
}
