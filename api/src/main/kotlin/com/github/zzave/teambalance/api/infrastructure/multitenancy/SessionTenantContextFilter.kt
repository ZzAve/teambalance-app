package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.persistence.SpringDataTeamMemberRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

private const val FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE + 3

@Component
@Order(FILTER_ORDER)
class SessionTenantContextFilter(
    private val teamMemberRepository: SpringDataTeamMemberRepository,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        // SessionUserContextFilter (order +2) already resolved and parsed the session user —
        // read it directly rather than re-parsing the session to avoid duplicating that logic.
        if (!TenantContext.isSet()) {
            // No team_members row means the user hasn't joined a team yet — leave TenantContext
            // unset rather than guessing, so callers see the neutral "public" default explicitly.
            UserContext.get()?.let { userId ->
                teamMemberRepository.findSchemaNameByUserId(userId)?.let { TenantContext.set(it) }
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }
}
