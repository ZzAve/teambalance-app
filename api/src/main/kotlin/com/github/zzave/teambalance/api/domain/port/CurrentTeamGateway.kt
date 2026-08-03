package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamId

interface CurrentTeamGateway {
    /** The team resolved for the current request, or throws if the caller has no active team. */
    fun requireCurrentTeamId(): TeamId
}
