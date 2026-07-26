package com.github.zzave.teambalance.api.infrastructure.identity

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import jakarta.servlet.FilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.mock.web.MockHttpSession
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/**
 * Unit test for the absolute session-lifetime cap. Spring Session enforces only a *sliding* idle
 * timeout; the hard "you must re-authenticate after N" cap is this filter's job. Pure filter, no
 * Spring context — the cap is driven by the injected [Clock] so no real waiting is needed.
 */
class SessionUserContextFilterTest : FunSpec({

    val absoluteTimeout = Duration.ofDays(90)
    val userId = UUID.randomUUID()

    fun authenticatedSession() = MockHttpSession().apply {
        setAttribute(SessionKeys.USER_ID, userId.toString())
    }

    // Runs the filter and returns (user visible to downstream handlers, whether the session was invalidated).
    fun run(clock: Clock, session: MockHttpSession): Pair<UUID?, Boolean> {
        val request = MockHttpServletRequest().apply { setSession(session) }
        var downstreamUser: UUID? = null
        val chain = FilterChain { _, _ -> downstreamUser = UserContext.get() }
        SessionUserContextFilter(clock, absoluteTimeout).doFilter(request, MockHttpServletResponse(), chain)
        return downstreamUser to session.isInvalid
    }

    test("a session within the absolute lifetime authenticates the request") {
        val session = authenticatedSession()
        val (user, invalidated) = run(Clock.fixed(Instant.now(), ZoneOffset.UTC), session)

        user shouldBe userId
        invalidated shouldBe false
    }

    test("a session past the absolute lifetime is invalidated and does not authenticate") {
        val session = authenticatedSession()
        val wayPastCap = Clock.fixed(Instant.now().plus(absoluteTimeout).plus(Duration.ofDays(1)), ZoneOffset.UTC)

        val (user, invalidated) = run(wayPastCap, session)

        user shouldBe null
        invalidated shouldBe true
    }
})
