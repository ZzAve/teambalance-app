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
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
class UserFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val userHeader = request.getHeader("X-User-Id")
        if (userHeader != null) {
            try {
                UserContext.set(UUID.fromString(userHeader))
            } catch (_: IllegalArgumentException) {
                // Malformed UUID — proceed without setting user context
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            UserContext.clear()
        }
    }
}
