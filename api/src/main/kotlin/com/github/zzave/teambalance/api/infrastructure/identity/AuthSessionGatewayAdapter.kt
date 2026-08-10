package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * The [AuthSessionGateway] adapter: the request's [jakarta.servlet.http.HttpSession] (Spring Session,
 * backed by Postgres) keyed by [SessionKeys]. Injected as the request-scoped proxy, so every call
 * resolves against the in-flight request — the same mechanism the controllers used before the session
 * moved behind a port.
 *
 * These are the same keys and the same string formats `SessionUserContextFilter` and
 * `SessionTenantContextFilter` read back, which is why they live in one shared [SessionKeys] object.
 */
@Component
class AuthSessionGatewayAdapter(
    private val request: HttpServletRequest,
) : AuthSessionGateway {

    override fun startSession(userId: UserId, routing: TenantRouting?) {
        val session = request.session
        session.setAttribute(SessionKeys.USER_ID, userId.value.toString())
        // Pin the tenant routing here, in this one uncontended request, so the SPA's first
        // authenticated burst reads it back instead of several requests racing to memoize it
        // (concurrent first-writes collide on SPRING_SESSION_ATTRIBUTES' primary key → 500). Schema +
        // team id come from one row so they can't diverge; format mirrors SessionTenantContextFilter.
        routing?.let {
            session.setAttribute(SessionKeys.TENANT_SCHEMA, it.schemaName)
            session.setAttribute(SessionKeys.TENANT_TEAM_ID, it.teamId.value.toString())
        }
    }

    override fun currentUserId(): UserId? =
        (request.getSession(false)?.getAttribute(SessionKeys.USER_ID) as? String)
            ?.let { UserId(UUID.fromString(it)) }

    override fun endSession() {
        request.getSession(false)?.invalidate()
    }
}
