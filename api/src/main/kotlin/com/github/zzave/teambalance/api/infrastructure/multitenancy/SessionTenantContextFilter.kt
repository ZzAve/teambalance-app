package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
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
    private val teamMemberRepository: TeamMemberRepository,
    private val currentUserGateway: CurrentUserGateway,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        // SessionUserContextFilter (order +2) already resolved and parsed the session user —
        // read it back through the gateway rather than re-parsing the session, to avoid duplicating
        // that logic. Resolve schema and team id together (one row) so they can never diverge; a user
        // with no team resolves to nothing (no silent "public" fallback for tenant-scoped work).
        currentUserGateway.getCurrentUserId()?.let { userId ->
            resolveRouting(request, userId)?.let { routing ->
                // Respect a tenant already pinned upstream (the test-profile X-Team-Id shim).
                if (!TenantContext.isSet()) TenantContext.set(routing.schemaName.value)
                CurrentTeamContext.set(routing.teamId.value)
            }
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
            CurrentTeamContext.clear()
        }
    }

    /**
     * The tenant routing is immutable per session in v1 (one team per user, fixed for the session),
     * so resolve it from the DB once and memoize schema + team id *together* on the session; later
     * requests read the cached pair, avoiding a `team_members JOIN teams` round-trip on every
     * authenticated call. Both are cached as a unit so a cached schema can never be paired with a
     * freshly-queried team id — the single-row guarantee holds across the cache too. On a miss
     * (first request, or a session surviving a restart) fall back to the DB. Multi-team support
     * (post-v1) will invalidate these attributes on team-switch.
     *
     * The memo's attribute names and formats live in [TenantRoutingSession], shared with
     * [TenantRoutingGatewayAdapter], which pins the same memo at sign-in. This filter reads the
     * session off the request it is handed rather than through that adapter's port: it runs at
     * `HIGHEST_PRECEDENCE + 3`, long before Spring binds the request-scoped proxy the adapter needs.
     */
    private fun resolveRouting(request: HttpServletRequest, userId: UserId): TenantRouting? {
        val session = request.getSession(false)
        TenantRoutingSession.read(session)?.let { return it }
        return teamMemberRepository.findTenantRouting(userId)?.also { TenantRoutingSession.write(session, it) }
    }
}
