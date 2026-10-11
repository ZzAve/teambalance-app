package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.application.BunqConnectionStatus as ApplicationStatus
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccounts as DomainBunqAccounts
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DisconnectBunq
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetBunqAccounts
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetBunqConnection
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.PutBunqAccount
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.StartBunqConnection
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqAccount
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqAccounts
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqAuthorization
import com.github.zzave.teambalance.api.interfaces.generated.model.BunqConnectionStatus
import org.springframework.web.bind.annotation.RestController

/**
 * Admin-only management of the team's Bunq connection (ADR-0042). The Admin check lives in
 * [BunqConnectionService]; a non-admin surfaces as 403 through the exception handler. The return trip
 * from Bunq is [BunqOAuthCallbackController].
 */
@RestController
class BunqConnectionController(
    private val bunqConnectionService: BunqConnectionService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetBunqConnection.Handler,
    StartBunqConnection.Handler,
    DisconnectBunq.Handler,
    GetBunqAccounts.Handler,
    PutBunqAccount.Handler {

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

    override suspend fun disconnectBunq(request: DisconnectBunq.Request): DisconnectBunq.Response<*> {
        bunqConnectionService.disconnect(currentUserGateway.requireCurrentUserId(), currentTeamGateway.requireCurrentTeamId())
        return DisconnectBunq.Response204(Unit)
    }

    override suspend fun getBunqAccounts(request: GetBunqAccounts.Request): GetBunqAccounts.Response<*> =
        GetBunqAccounts.Response200(
            bunqConnectionService.listAccounts(
                currentUserGateway.requireCurrentUserId(),
                currentTeamGateway.requireCurrentTeamId(),
            ).produce(),
        )

    override suspend fun putBunqAccount(request: PutBunqAccount.Request): PutBunqAccount.Response<*> {
        bunqConnectionService.pickAccount(
            currentUserGateway.requireCurrentUserId(),
            currentTeamGateway.requireCurrentTeamId(),
            BunqAccountId(request.body.accountId),
        )
        return PutBunqAccount.Response204(Unit)
    }
}

private fun ApplicationStatus.produce() = BunqConnectionStatus(
    connectAvailable = connectAvailable,
    connected = connected,
    accountPicked = accountPicked,
)

private fun DomainBunqAccounts.produce() = BunqAccounts(
    accounts = accounts.map { BunqAccount(id = it.id.value, name = it.name.value) },
    selectedAccountId = selected?.value,
)
