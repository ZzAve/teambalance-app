package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.application.CreatedTeam
import com.github.zzave.teambalance.api.application.TeamService
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ActivateTeam
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateMemberlessTeam
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateTeam
import com.github.zzave.teambalance.api.interfaces.generated.model.Team
import org.springframework.web.bind.annotation.RestController

/**
 * Creating a Team, and switching to one you already have.
 *
 * Neither resolves the current tenant: create-team's caller may have no Active Team, and switching
 * exists to *change* it. Both resolve only the current user and let [ActiveTeamService] decide.
 *
 * Create-team's error mapping (400 / opaque 403 / 409) comes from the thrown domain exceptions via
 * [GlobalExceptionHandler]; only the 201 branch is produced here.
 */
@RestController
class TeamController(
    private val teamService: TeamService,
    private val activeTeamService: ActiveTeamService,
    private val currentUserGateway: CurrentUserGateway,
) : CreateTeam.Handler,
    CreateMemberlessTeam.Handler,
    ActivateTeam.Handler {

    override suspend fun createTeam(request: CreateTeam.Request): CreateTeam.Response<*> {
        val founderId = currentUserGateway.requireCurrentUserId()
        val created = teamService.createTeam(
            founderId = founderId,
            rawName = request.body.name,
            rawSlug = request.body.slug,
            // Sent verbatim but trimmed — the code format is the issuer's concern (Slice 4), not ours.
            creationCode = CreationCode(request.body.creationCode.trim()),
        )
        return CreateTeam.Response201(created.toDto())
    }

    /**
     * Memberless creation by a Platform Admin (ADR-0024 §5): the team is provisioned with no members,
     * and the caller does not become one. The platform-admin gate lives in [TeamService]; a non-admin
     * caller surfaces as an opaque 403 via [GlobalExceptionHandler], like the rest of `/admin`. No
     * tenant is resolved — the caller is teamless — and, deliberately, no Active Team is set.
     */
    override suspend fun createMemberlessTeam(
        request: CreateMemberlessTeam.Request,
    ): CreateMemberlessTeam.Response<*> {
        val adminId = currentUserGateway.requireCurrentUserId()
        val created = teamService.createMemberlessTeam(
            adminId = adminId,
            rawName = request.body.name,
            rawSlug = request.body.slug,
        )
        return CreateMemberlessTeam.Response201(created.toDto())
    }

    /**
     * The one switch (ADR-0023 §2): a `/t/:slug/…` link and a tap in the switcher are the same
     * request. Unknown slug and not-a-Member both answer a bare 404, indistinguishably, and leave
     * the outgoing Active Team untouched.
     */
    override suspend fun activateTeam(request: ActivateTeam.Request): ActivateTeam.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val activated = activeTeamService.activateBySlug(userId, Slug(request.path.slug))
            ?: return ActivateTeam.Response404(Unit)
        return ActivateTeam.Response200(activated.produce())
    }
}

private fun CreatedTeam.toDto() = Team(
    id = id.produce(),
    name = name.value,
    slug = slug.value,
)
