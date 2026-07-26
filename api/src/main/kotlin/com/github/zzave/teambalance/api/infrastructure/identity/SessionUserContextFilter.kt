package com.github.zzave.teambalance.api.infrastructure.identity

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Clock
import java.time.Duration
import java.util.UUID

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
class SessionUserContextFilter(
    private val clock: Clock,
    // Absolute session lifetime: even a continuously-active session must re-authenticate after this.
    // Spring Session only enforces the *sliding* idle timeout (server.servlet.session.timeout); this
    // hard cap bounds how long a single login (and thus a stolen cookie) can live. See ADR-0015.
    @param:Value("\${teambalance.session.absolute-timeout:90d}") private val absoluteTimeout: Duration,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (UserContext.get() == null) {
            val session = request.getSession(false)
            val sessionUserId = session?.getAttribute(SessionKeys.USER_ID) as? String
            if (session != null && sessionUserId != null) {
                if (exceedsAbsoluteLifetime(session)) {
                    // Hard cap reached — drop the session so the request is unauthenticated and the
                    // user must request a fresh magic link.
                    session.invalidate()
                } else {
                    try {
                        UserContext.set(UUID.fromString(sessionUserId))
                    } catch (_: IllegalArgumentException) {
                        // Malformed session value — proceed without setting user context
                    }
                }
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            UserContext.clear()
        }
    }

    private fun exceedsAbsoluteLifetime(session: HttpSession): Boolean =
        Duration.ofMillis(clock.millis() - session.creationTime) > absoluteTimeout
}
