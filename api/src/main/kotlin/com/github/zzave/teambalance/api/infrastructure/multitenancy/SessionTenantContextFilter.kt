package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.application.ActAsResolution
import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

private const val FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE + 3

@Component
@Order(FILTER_ORDER)
class SessionTenantContextFilter(
    private val activeTeamService: ActiveTeamService,
    private val actAsService: ActAsService,
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
            ActAsContext.clear()
        }
    }

    /**
     * Act-as is asked first, and its answer is final — including when it is "the box ran out".
     *
     * That ordering is the whole expiry mechanism. Schema and team id are memoized on the session as
     * a pair and **a hit is not re-verified**, so an act-as grant that resolved through the memo like
     * an ordinary membership would keep routing for the four-week life of the session (ADR-0015) and
     * become the standing property ADR-0024 §2 forbids. A lapsed grant therefore also clears the memo
     * and resolves to *no tenant* — fail-safe, because a Platform Admin is structurally teamless
     * (ADR-0024 §3) and `TenantContext` routes no-tenant to a schema that intentionally does not exist.
     *
     * For everyone else (the overwhelming majority) nothing changed: since ADR-0023 §2 the memo decides
     * which Team the request is scoped to, so [ActiveTeamService] overwrites it on every switch; a
     * missed overwrite is a cross-tenant read, not a slow request. A hit is not re-verified against
     * `team_members`, so a Member removed mid-session keeps tenant reads until their session ends.
     * Per-action authorization still runs every request.
     *
     * The session is read off the request rather than through [TenantRoutingGatewayAdapter]'s port
     * because this filter runs long before Spring binds the request-scoped proxy that adapter needs.
     */
    private fun resolveRouting(request: HttpServletRequest, userId: UserId): TenantRouting? {
        val session = request.getSession(false)
        return when (val actAs = actAsService.resolve(userId)) {
            is ActAsResolution.Active -> {
                ActAsContext.set(actAs.actAs)
                actAs.routing
            }
            is ActAsResolution.Lapsed -> {
                ActAsContext.markLapsed(actAs.actAs)
                TenantRoutingSession.clear(session)
                null
            }
            ActAsResolution.None -> memoized(session, userId)
        }
    }

    private fun memoized(session: HttpSession?, userId: UserId): TenantRouting? =
        TenantRoutingSession.read(session)
            ?: activeTeamService.resolveLanding(userId)?.also { TenantRoutingSession.write(session, it) }
}
