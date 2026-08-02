package com.github.zzave.teambalance.api.domain.port

import java.util.UUID

interface CurrentTeamGateway {
    /** The team resolved for the current request, or throws if the caller has no active team. */
    fun requireCurrentTeamId(): UUID
}
