package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Component

/**
 * The [TenantRoutingGateway] adapter: pins the routing as a memo on the caller's session, in the
 * exact shape [SessionTenantContextFilter] reads back ([TenantRoutingSession]).
 *
 * Takes the request-scoped [HttpServletRequest] proxy, which only resolves once Spring's
 * `RequestContextFilter` (order -105) has bound the request. That holds here — pinning happens on
 * the sign-in request, inside a controller — but *not* for [SessionTenantContextFilter] at
 * `HIGHEST_PRECEDENCE + 3`, which is why the filter reads the memo off the request it is handed
 * rather than through this port.
 */
@Component
class TenantRoutingGatewayAdapter(
    private val request: HttpServletRequest,
) : TenantRoutingGateway {

    override fun pinRouting(routing: TenantRouting) = TenantRoutingSession.write(request.session, routing)
}
