package com.github.zzave.teambalance.api.infrastructure.multitenancy

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Profile
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Profile("test")
@Order(Ordered.HIGHEST_PRECEDENCE)
class TenantFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val tenantHeader = request.getHeader("X-Team-Id")
        if (tenantHeader != null) {
            // Test-profile-only shim; prod resolves tenant from the session (SessionTenantContextFilter).
            TenantContext.set("team_$tenantHeader")
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }
}
