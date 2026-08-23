package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.application.CreatedTeam
import com.github.zzave.teambalance.api.application.TeamService
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ActivateTeam
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateTeam
import com.github.zzave.teambalance.api.interfaces.generated.model.Team
import org.springframework.web.bind.annotation.RestController

/**
 * The two ways a caller comes to be working in a Team: creating one, and switching to one they
 * already have.
 *
 * Neither resolves the current tenant (`requireCurrentTeamId`) — create-team's caller may have no
 * Active Team at all, and switch-team's whole job is to *change* it, so reading the outgoing one
 * would prove nothing. Both resolve only the current *user* and let [ActiveTeamService] decide what
 * they may have.
 *
 * Create-team's error mapping (bad name → 400, invalid code → opaque 403, slug clash → 409) is
 * handled by the thrown domain exceptions via [GlobalExceptionHandler]; only the 201 success branch
 * is produced here.
 */
@RestController
class TeamController(
    private val teamService: TeamService,
    private val activeTeamService: ActiveTeamService,
    private val currentUserGateway: CurrentUserGateway,
) : CreateTeam.Handler,
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
     * Switches the caller's Active Team to the Team at this slug (ADR-0023 §2) — the request a
     * `/t/:slug/…` link performs on the way in, and the one the switcher performs on a tap. They are
     * deliberately the same request.
     *
     * A slug that is unknown, and one that names a Team the caller is not a Member of, both answer
     * 404 with no body: the two are indistinguishable so the Team address space cannot be probed for
     * which Teams exist. Nothing about the outgoing Active Team changes on a failed switch.
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
