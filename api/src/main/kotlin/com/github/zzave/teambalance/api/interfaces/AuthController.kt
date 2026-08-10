package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetAuthMe
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.Logout
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RequestMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.VerifyMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.model.AuthenticatedUser
import com.github.zzave.teambalance.api.interfaces.generated.model.TeamRef
import jakarta.servlet.http.HttpServletRequest
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AuthController(
    private val authService: AuthService,
    private val teamMemberRepository: TeamMemberRepository,
    private val httpServletRequest: HttpServletRequest,
) : RequestMagicLink.Handler,
    VerifyMagicLink.Handler,
    Logout.Handler,
    GetAuthMe.Handler {

    override suspend fun requestMagicLink(request: RequestMagicLink.Request): RequestMagicLink.Response<*> {
        authService.requestMagicLink(request.body.email.consumeEmail())
        return RequestMagicLink.Response202(Unit)
    }

    override suspend fun verifyMagicLink(request: VerifyMagicLink.Request): VerifyMagicLink.Response<*> {
        val user = authService.verifyMagicLink(request.body.token) ?: return VerifyMagicLink.Response401(Unit)
        val session = httpServletRequest.session
        session.setAttribute(SessionKeys.USER_ID, user.id.produce())
        // Pin the tenant routing onto the session now, in this single uncontended request, so the
        // SPA's first authenticated burst reads it back (SessionTenantContextFilter cache hit) instead
        // of several concurrent requests all memoizing it at once. Those concurrent first-writes each
        // INSERT the same SPRING_SESSION_ATTRIBUTES row and all but one collide on the primary key —
        // a DuplicateKeyException that escapes as an empty-body 500. Schema + team id are written
        // together (one row) so they can never diverge; the filter keeps the lazy fallback for
        // sessions that predate this (e.g. a user joining a team mid-session). Keys/format mirror
        // SessionTenantContextFilter.cache().
        teamMemberRepository.findTenantRouting(user.id)?.let { routing ->
            session.setAttribute(SessionKeys.TENANT_SCHEMA, routing.schemaName)
            session.setAttribute(SessionKeys.TENANT_TEAM_ID, routing.teamId.value.toString())
        }
        return VerifyMagicLink.Response200(
            AuthenticatedUser(
                id = user.id.produce(),
                email = user.email.produce(),
                displayName = user.displayName,
                role = resolveRole(user.id),
                team = resolveTeam(user.id),
                isPlatformAdmin = authService.isPlatformAdmin(user.id),
            ),
        )
    }

    override suspend fun logout(request: Logout.Request): Logout.Response<*> {
        httpServletRequest.getSession(false)?.invalidate()
        return Logout.Response204(Unit)
    }

    override suspend fun getAuthMe(request: GetAuthMe.Request): GetAuthMe.Response<*> {
        val user = (httpServletRequest.getSession(false)?.getAttribute(SessionKeys.USER_ID) as? String)
            ?.let { authService.findUserById(it.consumeUserId()) }
        return user?.let {
            GetAuthMe.Response200(
                AuthenticatedUser(
                    id = it.id.produce(),
                    email = it.email.produce(),
                    displayName = it.displayName,
                    role = resolveRole(it.id),
                    team = resolveTeam(it.id),
                    isPlatformAdmin = authService.isPlatformAdmin(it.id),
                ),
            )
        } ?: GetAuthMe.Response401(Unit)
    }

    private fun resolveRole(userId: UserId): String? =
        teamMemberRepository.findTeamId(userId)?.let { teamId -> teamMemberRepository.findRole(teamId, userId) }?.name

    // The has-a-team gate signal (#158): a null team means the caller is teamless and belongs on
    // /create-team. Resolved through the application service so this inbound layer keeps no port
    // dependency of its own (ADR-0018). v1: one team per user.
    private fun resolveTeam(userId: UserId): TeamRef? =
        authService.findTeamFor(userId)
            ?.let { TeamRef(id = it.id.toString(), name = it.name, slug = it.slug) }
}

// The Wirespec edge for a user's identity — the contract, and the session attribute the auth filter
// reads back, both still carry a bare UUID string. internal so every controller that names a user
// (member, attendance) converts the same way.
internal fun String.consumeUserId(): UserId = UserId(UUID.fromString(this))

internal fun UserId.produce(): String = value.toString()

// The Wirespec edge for an email address — the contract carries it as a plain string, and this is
// the only place a caller hands one in or reads one back.
private fun String.consumeEmail(): Email = Email(this)

private fun Email.produce(): String = value
