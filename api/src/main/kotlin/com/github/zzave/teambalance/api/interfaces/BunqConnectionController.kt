package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.application.BunqConnectionStatus as ApplicationStatus
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetBunqConnection
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.StartBunqConnection
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqAuthorization
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqConnectionStatus
import org.springframework.web.bind.annotation.RestController

/**
 * Admin-only start of the team's Bunq connection (ADR-0042). The Admin check lives in
 * [BunqConnectionService]; a non-admin surfaces as 403 through the exception handler. The return trip
 * from Bunq is [BunqOAuthCallbackController].
 */
@RestController
class BunqConnectionController(
    private val bunqConnectionService: BunqConnectionService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetBunqConnection.Handler,
    StartBunqConnection.Handler {

    override suspend fun getBunqConnection(request: GetBunqConnection.Request): GetBunqConnection.Response<*> =
        GetBunqConnection.Response200(
            bunqConnectionService.status(currentUserGateway.requireCurrentUserId(), currentTeamGateway.requireCurrentTeamId())
                .produce(),
        )

    override suspend fun startBunqConnection(request: StartBunqConnection.Request): StartBunqConnection.Response<*> =
        StartBunqConnection.Response201(
            BunqAuthorization(
                url = bunqConnectionService.start(
                    currentUserGateway.requireCurrentUserId(),
                    currentTeamGateway.requireCurrentTeamId(),
                ),
            ),
        )
}

private fun ApplicationStatus.produce() = BunqConnectionStatus(
    connectAvailable = connectAvailable,
    connected = connected,
)
