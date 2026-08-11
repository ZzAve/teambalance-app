package com.github.zzave.teambalance.api.infrastructure.identity

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
 * This is the same key and the same string format `SessionUserContextFilter` reads back, which is
 * why it lives in the shared [SessionKeys] object.
 */
@Component
class AuthSessionGatewayAdapter(
    private val request: HttpServletRequest,
) : AuthSessionGateway {

    override fun startSession(userId: UserId) {
        request.session.setAttribute(SessionKeys.USER_ID, userId.value.toString())
    }

    override fun currentUserId(): UserId? =
        (request.getSession(false)?.getAttribute(SessionKeys.USER_ID) as? String)
            ?.let { UserId(UUID.fromString(it)) }

    override fun endSession() {
        request.getSession(false)?.invalidate()
    }
}
