package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.domain.port.RequestScopeGateway
import org.springframework.stereotype.Component

@Component
class RequestScopeAdapter(
    private val currentUser: CurrentUserGateway,
    private val currentTeam: CurrentTeamGateway,
) : RequestScopeGateway {
    override fun teamScope(): TeamScope =
        TeamScope(currentUser.requireCurrentUserId(), currentTeam.requireCurrentTeamId())
}
