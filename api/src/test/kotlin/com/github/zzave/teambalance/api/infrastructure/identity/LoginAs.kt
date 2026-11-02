package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantRoutingSession
import jakarta.servlet.http.Cookie
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.session.Session
import org.springframework.session.SessionRepository
import org.springframework.test.web.servlet.request.RequestPostProcessor
import org.springframework.web.context.support.WebApplicationContextUtils
import java.util.Base64
import java.util.UUID

/**
 * The one place a test says who is calling: `mockMvc.perform(post(...).with(loginAs(userId)))`.
 *
 * It signs [userId] in the way the app does — a real session in the JDBC store, carrying the `userId`
 * attribute, presented as the `SESSION` cookie — so the request goes through `SessionUserContextFilter`,
 * the tenant filter and the SecurityFilterChain exactly as a browser's would. It also adds a valid CSRF
 * token, so a mutating request passes the chain's CSRF check.
 *
 * [tenant] pins the schema the request is routed to, for the fixtures whose tenant tables sit in a
 * schema their team row does not name (see `V3_2__test_position_helper_tenant.sql`). It is written as the
 * session's tenant-routing memo, paired with the team the user would land on, so it takes effect where
 * the memo does: for a caller who is not acting as a Platform Admin and has a team to land on.
 *
 * Every call is a new session, so nothing carries from one request to the next.
 */
fun loginAs(userId: UUID, tenant: String? = null): RequestPostProcessor = RequestPostProcessor { request ->
    val context = WebApplicationContextUtils.getRequiredWebApplicationContext(request.servletContext)

    @Suppress("UNCHECKED_CAST")
    val sessions = context.getBean(SessionRepository::class.java) as SessionRepository<Session>
    val session = sessions.createSession()
    session.setAttribute(SessionKeys.USER_ID, userId.toString())
    tenant?.let {
        context.getBean(ActiveTeamService::class.java).resolveLanding(UserId(userId))?.let { landing ->
            session.setAttribute(TenantRoutingSession.TENANT_SCHEMA, it)
            session.setAttribute(TenantRoutingSession.TENANT_TEAM_ID, landing.teamId.value.toString())
        }
    }
    sessions.save(session)

    request.setCookies(*request.cookies.orEmpty(), sessionCookie(session.id))
    csrf().postProcessRequest(request)
}

fun loginAs(userId: String, tenant: String? = null): RequestPostProcessor = loginAs(UUID.fromString(userId), tenant)

/** The cookie Spring Session's default serializer writes: the session ID, Base64-encoded. */
private fun sessionCookie(sessionId: String) =
    Cookie("SESSION", Base64.getEncoder().encodeToString(sessionId.toByteArray()))
