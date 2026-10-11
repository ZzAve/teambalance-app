package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.TopUpService
import com.github.zzave.teambalance.api.domain.model.TopUpAmount
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetTopUpLink
import com.github.zzave.teambalance.api.interfaces.generated.model.TopUpLink
import org.springframework.web.bind.annotation.RestController

@RestController
class TopUpController(
    private val topUpService: TopUpService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetTopUpLink.Handler {

    // Any member of the current team; an amount outside 1..500 surfaces as 400 via TopUpAmount.
    override suspend fun getTopUpLink(request: GetTopUpLink.Request): GetTopUpLink.Response<*> =
        GetTopUpLink.Response200(
            TopUpLink(
                url = topUpService.topUpLink(
                    userId = currentUserGateway.requireCurrentUserId(),
                    teamId = currentTeamGateway.requireCurrentTeamId(),
                    amount = TopUpAmount.ofWhole(request.queries.amount),
                ),
            ),
        )
}
