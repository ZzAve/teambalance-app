package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetAuthMe
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.Logout
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RequestMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.VerifyMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.model.AuthenticatedUser
import com.github.zzave.teambalance.api.interfaces.generated.model.TeamRef
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AuthController(
    private val authService: AuthService,
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
        authService.startSession(user.id)
        return VerifyMagicLink.Response200(
            AuthenticatedUser(
                id = user.id.produce(),
                email = user.email.produce(),
                displayName = user.displayName.value,
                role = resolveRole(user.id),
                team = resolveTeam(user.id),
                isPlatformAdmin = authService.isPlatformAdmin(user.id),
            ),
        )
    }

    override suspend fun logout(request: Logout.Request): Logout.Response<*> {
        authService.endSession()
        return Logout.Response204(Unit)
    }

    override suspend fun getAuthMe(request: GetAuthMe.Request): GetAuthMe.Response<*> =
        authService.currentUser()?.let {
            GetAuthMe.Response200(
                AuthenticatedUser(
                    id = it.id.produce(),
                    email = it.email.produce(),
                    displayName = it.displayName.value,
                    role = resolveRole(it.id),
                    team = resolveTeam(it.id),
                    isPlatformAdmin = authService.isPlatformAdmin(it.id),
                ),
            )
        } ?: GetAuthMe.Response401(Unit)

    private fun resolveRole(userId: UserId): String? = authService.findRoleFor(userId)?.name

    // The has-a-team gate signal (#158): a null team means the caller is teamless and belongs on
    // /create-team. Resolved through the application service so this inbound layer keeps no port
    // dependency of its own (ADR-0018). v1: one team per user.
    private fun resolveTeam(userId: UserId): TeamRef? =
        authService.findTeamFor(userId)
            ?.let { TeamRef(id = it.id.toString(), name = it.name.value, slug = it.slug.value) }
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
