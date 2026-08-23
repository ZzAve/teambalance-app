package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamId

interface CurrentTeamGateway {
    /** The Active Team for the current request, or throws if the caller has no active team. */
    fun requireCurrentTeamId(): TeamId

    /** The Active Team for the current request, or null when none is resolved. */
    fun findCurrentTeamId(): TeamId?
}
