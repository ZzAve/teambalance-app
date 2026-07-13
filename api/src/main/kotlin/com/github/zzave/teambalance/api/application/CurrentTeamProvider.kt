package com.github.zzave.teambalance.api.application

import java.util.UUID

interface CurrentTeamProvider {
    /** The team resolved for the current request, or throws if the caller has no active team. */
    fun requireCurrentTeamId(): UUID
}
