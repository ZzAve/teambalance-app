package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.stereotype.Component

@Component
class RequestScope(
    private val currentUser: CurrentUserGateway,
    private val currentTeam: CurrentTeamGateway,
) {
    /**
     * The authenticated principal and Active Team of the current request. Throws when there is no
     * principal, and when there is no Active Team (`NO_TEAM_MEMBERSHIP`, or `ACT_AS_EXPIRED` for a
     * lapsed act-as).
     */
    fun teamScope(): TeamScope =
        TeamScope(currentUser.requireCurrentUserId(), currentTeam.requireCurrentTeamId())
}
