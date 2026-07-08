package com.github.zzave.teambalance.api.infrastructure.identity

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
class SessionUserContextFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (UserContext.get() == null) {
            val sessionUserId = request.getSession(false)?.getAttribute(SessionKeys.USER_ID) as? String
            sessionUserId?.let {
                try {
                    UserContext.set(UUID.fromString(it))
                } catch (_: IllegalArgumentException) {
                    // Malformed session value — proceed without setting user context
                }
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            UserContext.clear()
        }
    }
}
