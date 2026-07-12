package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.persistence.SpringDataTeamMemberRepository
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
                resolveSchemaName(request, userId)?.let { TenantContext.set(it) }
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }

    /**
     * The tenant schema is immutable per session in v1 (one team per user, fixed for the session),
     * so resolve it from the DB once and memoize it on the session. Subsequent requests read the
     * cached value, avoiding a `team_members JOIN teams` round-trip on every authenticated call.
     * On a cache miss (first request, or a surviving session after a restart) fall back to the DB.
     * Multi-team support (post-v1) will invalidate this attribute on team-switch.
     */
    private fun resolveSchemaName(request: HttpServletRequest, userId: UUID): String? {
        val session = request.getSession(false)
        (session?.getAttribute(SessionKeys.TENANT_SCHEMA) as? String)?.let { return it }
        return teamMemberRepository.findSchemaNameByUserId(userId)?.also { schemaName ->
            session?.setAttribute(SessionKeys.TENANT_SCHEMA, schemaName)
        }
    }
}
