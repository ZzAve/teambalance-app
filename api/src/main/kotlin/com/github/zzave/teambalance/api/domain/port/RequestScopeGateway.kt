package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamScope

interface RequestScopeGateway {
    /**
     * The authenticated principal and Active Team of the current request. Throws when there is no
     * principal, and when there is no Active Team (`NO_TEAM_MEMBERSHIP`, or `ACT_AS_EXPIRED` for a
     * lapsed act-as).
     */
    fun teamScope(): TeamScope
}
