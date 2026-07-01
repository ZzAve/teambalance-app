package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

private const val FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE + 3

@Component
@Order(FILTER_ORDER)
class SessionTenantContextFilter(
    private val teamMemberRepository: TeamMemberRepository,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (!TenantContext.isSet()) {
            val sessionUserId = request.getSession(false)?.getAttribute(SessionKeys.USER_ID) as? String
            sessionUserId?.let { resolveAndSetTenant(it) }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }

    private fun resolveAndSetTenant(rawUserId: String) {
        try {
            val userId = UUID.fromString(rawUserId)
            // No team_members row means the user hasn't joined a team yet — leave TenantContext
            // unset rather than guessing, so callers see the neutral "public" default explicitly.
            teamMemberRepository.findSchemaNameForUser(userId)?.let { TenantContext.set(it) }
        } catch (_: IllegalArgumentException) {
            // Malformed session value — proceed without setting tenant context
        }
    }
}
