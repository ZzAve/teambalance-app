package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetAuthMe
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.Logout
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RequestMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.VerifyMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.model.AuthenticatedUser
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
        authService.requestMagicLink(request.body.email)
        return RequestMagicLink.Response202(Unit)
    }

    override suspend fun verifyMagicLink(request: VerifyMagicLink.Request): VerifyMagicLink.Response<*> {
        val user = authService.verifyMagicLink(request.body.token) ?: return VerifyMagicLink.Response401(Unit)
        httpServletRequest.session.setAttribute(SessionKeys.USER_ID, user.id.produce())
        return VerifyMagicLink.Response200(
            AuthenticatedUser(
                id = user.id.produce(),
                email = user.email,
                displayName = user.displayName,
                role = resolveRole(user.id),
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
                    email = it.email,
                    displayName = it.displayName,
                    role = resolveRole(it.id),
                ),
            )
        } ?: GetAuthMe.Response401(Unit)
    }

    private fun resolveRole(userId: UserId): String? =
        teamMemberRepository.findTeamId(userId)?.let { teamId -> teamMemberRepository.findRole(teamId, userId) }?.name
}

// The Wirespec edge for a user's identity — the contract, and the session attribute the auth filter
// reads back, both still carry a bare UUID string. internal so every controller that names a user
// (member, attendance) converts the same way.
internal fun String.consumeUserId(): UserId = UserId(UUID.fromString(this))

internal fun UserId.produce(): String = value.toString()
