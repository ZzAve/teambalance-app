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
        // SessionUserContextFilter (order +2) already resolved and parsed the session user —
        // read it back through the gateway rather than re-parsing the session, to avoid duplicating
        // that logic. Schema and team id are resolved together (one row) so they can never diverge; a
        // caller with no Active Team resolves to nothing (no silent "public" fallback for
        // tenant-scoped work).
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
     * The Active Team is carried on the session, so read the memo first: schema + team id are memoized
     * *together* and later requests read the cached pair, avoiding a `team_members JOIN teams`
     * round-trip on every authenticated call. Both are cached as a unit so a cached schema can never be
     * paired with a freshly-queried team id.
     *
     * Since #143 that memo is a **correctness** concern, not a cache (ADR-0021 §2): it is what says
     * which Team the request is scoped to, so every switch must overwrite it — [ActiveTeamService]
     * owns that, by re-pinning through [TenantRoutingGatewayAdapter] on the way through. A missed
     * overwrite here is a cross-tenant read, not a slow request.
     *
     * On a miss — a session predating the pin, or a caller who was teamless when they signed in and
     * has since joined — fall back to the same landing resolution sign-in uses: the remembered Active
     * Team while it is still a valid membership, else a sole membership, else nothing. It never picks
     * between several Teams; a caller with several and none remembered simply has no tenant here and
     * is asked to choose.
     *
     * A memo hit is NOT re-verified against `team_members` — that is what makes it a memo rather than
     * a query. The membership was verified when it was written (at sign-in, or by the switch that
     * pinned it), so a caller removed from a Team mid-session keeps tenant access until their session
     * ends, which under a four-week sliding window (ADR-0015) is a long time. That is unchanged by
     * #143 and out of its scope; removing a Member is not yet a session-invalidating event anywhere.
     * Authorization for individual actions still runs per request through
     * [AuthorizationService][com.github.zzave.teambalance.api.application.AuthorizationService], so
     * what a removed Member retains is reads, not admin rights.
     *
     * The memo's attribute names and formats live in [TenantRoutingSession], shared with
     * [TenantRoutingGatewayAdapter], which pins the same memo at sign-in and on every switch. This
     * filter reads the session off the request it is handed rather than through that adapter's port:
     * it runs at `HIGHEST_PRECEDENCE + 3`, long before Spring binds the request-scoped proxy the
     * adapter needs.
     */
    private fun resolveRouting(request: HttpServletRequest, userId: UserId): TenantRouting? {
        val session = request.getSession(false)
        TenantRoutingSession.read(session)?.let { return it }
        return activeTeamService.resolveLanding(userId)?.also { TenantRoutingSession.write(session, it) }
    }
}
