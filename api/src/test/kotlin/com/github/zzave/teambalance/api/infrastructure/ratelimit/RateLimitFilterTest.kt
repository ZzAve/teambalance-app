package com.github.zzave.teambalance.api.infrastructure.ratelimit

import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.identity.UserContextCurrentUserAdapter
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.springframework.mock.web.MockFilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private const val REQUEST_PATH = "/api/auth/magic-link/request"
private const val VERIFY_PATH = "/api/auth/magic-link/verify"
private const val ACCEPT_PATH = "/api/invitations/some-token/accept"

private fun props(
    enabled: Boolean = true,
    trustForwardedFor: Boolean = true,
    capacity: Long = 2,
): RateLimitProperties {
    val policy = RateLimitProperties.Policy(capacity, Duration.ofMinutes(1))
    return RateLimitProperties(
        enabled = enabled,
        trustForwardedFor = trustForwardedFor,
        magicLinkRequest = policy,
        magicLinkVerify = policy,
        invitationAccept = policy,
    )
}

private fun filter(properties: RateLimitProperties): RateLimitFilter =
    RateLimitFilter(
        RateLimiter(Clock.fixed(Instant.EPOCH, ZoneOffset.UTC)),
        properties,
        UserContextCurrentUserAdapter(),
    )

private fun RateLimitFilter.call(
    method: String = "POST",
    path: String,
    remoteAddr: String = "10.0.0.1",
    forwardedFor: String? = null,
    userId: UUID? = null,
): MockHttpServletResponse {
    val request = MockHttpServletRequest(method, path)
    request.remoteAddr = remoteAddr
    forwardedFor?.let { request.addHeader("X-Forwarded-For", it) }
    val response = MockHttpServletResponse()
    userId?.let { UserContext.set(it) }
    try {
        doFilter(request, response, MockFilterChain())
    } finally {
        UserContext.clear()
    }
    return response
}

class RateLimitFilterTest : FunSpec({

    test("lets an unmatched path straight through") {
        val response = filter(props()).call(path = "/api/events")
        response.status shouldBe 200
    }

    test("does not throttle a non-POST on a throttled path") {
        val f = filter(props(capacity = 1))
        f.call(method = "GET", path = REQUEST_PATH).status shouldBe 200
        f.call(method = "GET", path = REQUEST_PATH).status shouldBe 200
    }

    test("allows up to capacity then answers 429 with Retry-After and the standard error body") {
        val f = filter(props(capacity = 2))

        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200

        val blocked = f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1")
        blocked.status shouldBe 429
        // capacity 2 / 60s ⇒ one token every 30s, so the next is ~30s out.
        blocked.getHeader("Retry-After") shouldBe "30"
        blocked.contentType shouldContain "application/json"
        blocked.contentAsString shouldContain "\"code\":\"rate_limited\""
    }

    test("magic-link request is keyed per client IP (X-Forwarded-For)") {
        val f = filter(props(capacity = 1))

        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 429
        // A different client IP has its own fresh allowance.
        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.9").status shouldBe 200
    }

    test("request and verify buckets are independent for the same IP") {
        val f = filter(props(capacity = 1))

        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 429
        // Exhausting request must not throttle verify.
        f.call(path = VERIFY_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
    }

    test("invitation accept is keyed per user, independent of IP") {
        val f = filter(props(capacity = 1))
        val alice = UUID.randomUUID()
        val bob = UUID.randomUUID()

        // Same shared IP, but two different users each keep their own allowance.
        f.call(path = ACCEPT_PATH, forwardedFor = "203.0.113.1", userId = alice).status shouldBe 200
        f.call(path = ACCEPT_PATH, forwardedFor = "203.0.113.1", userId = alice).status shouldBe 429
        f.call(path = ACCEPT_PATH, forwardedFor = "203.0.113.1", userId = bob).status shouldBe 200
    }

    test("invitation accept falls back to IP when there is no authenticated user") {
        val f = filter(props(capacity = 1))

        f.call(path = ACCEPT_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = ACCEPT_PATH, forwardedFor = "203.0.113.1").status shouldBe 429
    }

    test("uses remoteAddr when X-Forwarded-For is not trusted") {
        val f = filter(props(trustForwardedFor = false, capacity = 1))

        // XFF is ignored, so both requests key on the same remoteAddr and the second is throttled.
        f.call(path = REQUEST_PATH, remoteAddr = "10.0.0.5", forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = REQUEST_PATH, remoteAddr = "10.0.0.5", forwardedFor = "203.0.113.2").status shouldBe 429
    }

    test("disabled filter never throttles") {
        val f = filter(props(enabled = false, capacity = 1))

        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
        f.call(path = REQUEST_PATH, forwardedFor = "203.0.113.1").status shouldBe 200
    }
})
