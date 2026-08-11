package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CreatedTeam
import com.github.zzave.teambalance.api.application.TeamService
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateTeam
import com.github.zzave.teambalance.api.interfaces.generated.model.Team
import org.springframework.web.bind.annotation.RestController

/**
 * Self-service team creation (#154, ADR-0019). The caller is authenticated but, by definition, has no
 * team yet — so this only resolves the current *user* (never `requireCurrentTeamId`, which would
 * fail-closed with 403 for a teamless user). Error mapping (bad name → 400, invalid code → opaque 403,
 * already-in-team / slug clash → 409) is handled by the thrown domain exceptions via
 * [GlobalExceptionHandler]; only the 201 success branch is produced here.
 */
@RestController
class TeamController(
    private val teamService: TeamService,
    private val currentUserGateway: CurrentUserGateway,
) : CreateTeam.Handler {

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
}

private fun CreatedTeam.toDto() = Team(
    id = id.toString(),
    name = name.value,
    slug = slug.value,
)
