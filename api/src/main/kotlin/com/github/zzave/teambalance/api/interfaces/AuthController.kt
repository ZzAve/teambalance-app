package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
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
    private val actAsService: ActAsService,
    private val currentTeamGateway: CurrentTeamGateway,
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
        // Not readable from the request context: the tenant filter ran before this session existed.
        val activeTeamId = authService.startSession(user.id)
        return VerifyMagicLink.Response200(describe(user, activeTeamId))
    }

    override suspend fun logout(request: Logout.Request): Logout.Response<*> {
        authService.endSession()
        return Logout.Response204(Unit)
    }

    override suspend fun getAuthMe(request: GetAuthMe.Request): GetAuthMe.Response<*> =
        authService.currentUser()
            ?.let { GetAuthMe.Response200(describe(it, currentTeamGateway.findCurrentTeamId())) }
            ?: GetAuthMe.Response401(Unit)

    /**
     * [activeTeamId] is intersected with the memberships rather than reported as given, so the payload
     * can only ever name a Team the caller actually has. `role` is read for that same Team.
     *
     * Act-as is the one case where the Active Team is *not* a membership: a Platform Admin inside a
     * Team has an empty `teams` and is nonetheless scoped to that Team, as its ADMIN. Reporting it
     * here is what lets the frontend's one route gate handle both worlds — and it is read off the
     * grant the request pipeline already resolved, not re-derived (ADR-0024 §2).
     */
    private fun describe(user: User, activeTeamId: TeamId?): AuthenticatedUser {
        val teams = authService.findTeamsFor(user.id)
        val actAs = actAsService.current()
        val activeTeam = actAs?.team ?: activeTeamId?.let { id -> teams.firstOrNull { it.id == id } }
        return AuthenticatedUser(
            id = user.id.produce(),
            email = user.email.produce(),
            displayName = user.displayName.value,
            // Real membership first, synthesis second — the same precedence AuthorizationService
            // applies. A caller who somehow held both would otherwise be shown admin UI that every
            // write then refuses.
            role = activeTeam?.let { authService.findRoleIn(it.id, user.id)?.name }
                ?: actAs?.let { Role.ADMIN.name },
            teams = teams.map { it.produce() },
            activeTeam = activeTeam?.produce(),
            isPlatformAdmin = authService.isPlatformAdmin(user.id),
            actAs = actAs?.produce(),
        )
    }
}

// The Wirespec edge for a Team's public identity; the tenant schema is deliberately absent.
internal fun TeamSummary.produce() = TeamRef(id = id.produce(), name = name.value, slug = slug.value)

// The Wirespec edge for a user's identity — the contract, and the session attribute the auth filter
// reads back, both still carry a bare UUID string. internal so every controller that names a user
// (member, attendance) converts the same way.
internal fun String.consumeUserId(): UserId = UserId(UUID.fromString(this))

internal fun UserId.produce(): String = value.toString()

// The Wirespec edge for an email address — the contract carries it as a plain string, and this is
// the only place a caller hands one in or reads one back.
private fun String.consumeEmail(): Email = Email(this)

private fun Email.produce(): String = value
