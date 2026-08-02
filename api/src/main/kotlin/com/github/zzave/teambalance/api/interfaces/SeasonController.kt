package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.SeasonService
import com.github.zzave.teambalance.api.domain.model.Season as DomainSeason
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetSeason
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetSeason
import com.github.zzave.teambalance.api.interfaces.generated.model.Season
import com.github.zzave.teambalance.api.interfaces.generated.model.SeasonDate
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class SeasonController(
    private val seasonService: SeasonService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetSeason.Handler,
    SetSeason.Handler {

    // Readable by any member of the current team; the tenant is resolved from the request context.
    override suspend fun getSeason(request: GetSeason.Request): GetSeason.Response<*> =
        GetSeason.Response200(seasonService.getSeason().produce())

    // Admin-only (enforced in SeasonService.setSeason); a non-admin surfaces as 403 via the handler.
    override suspend fun setSeason(request: SetSeason.Request): SetSeason.Response<*> {
        val season = seasonService.setSeason(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            start = request.body.start?.toLocalDate(),
            end = request.body.end?.toLocalDate(),
        )
        return SetSeason.Response200(season.produce())
    }
}

private fun DomainSeason.produce() =
    Season(start = start?.let { SeasonDate(it.toString()) }, end = end?.let { SeasonDate(it.toString()) })

private fun SeasonDate.toLocalDate(): LocalDate = LocalDate.parse(value)
