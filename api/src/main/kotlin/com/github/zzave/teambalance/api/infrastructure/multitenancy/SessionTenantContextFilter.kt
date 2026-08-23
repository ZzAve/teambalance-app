package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
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
    private val activeTeamService: ActiveTeamService,
    private val currentUserGateway: CurrentUserGateway,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
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
     * Schema and team id are memoized on the session as a pair, so a cached schema can never be
     * paired with a freshly-queried team id. Since ADR-0023 §2 that memo decides which Team the
     * request is scoped to, so [ActiveTeamService] overwrites it on every switch; a missed overwrite
     * is a cross-tenant read, not a slow request.
     *
     * A hit is not re-verified against `team_members`, so a Member removed mid-session keeps tenant
     * reads until their session ends. Per-action authorization still runs every request.
     *
     * The session is read off the request rather than through [TenantRoutingGatewayAdapter]'s port
     * because this filter runs long before Spring binds the request-scoped proxy that adapter needs.
     */
    private fun resolveRouting(request: HttpServletRequest, userId: UserId): TenantRouting? {
        val session = request.getSession(false)
        TenantRoutingSession.read(session)?.let { return it }
        return activeTeamService.resolveLanding(userId)?.also { TenantRoutingSession.write(session, it) }
    }
}
