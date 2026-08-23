package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamId

interface CurrentTeamGateway {
    /** The Active Team for the current request, or throws if the caller has no active team. */
    fun requireCurrentTeamId(): TeamId

    /**
     * The Active Team for the current request, or null when none is resolved. The nullable read for
     * the one caller that must describe a teamless user rather than reject them (`/auth/me`).
     */
    fun findCurrentTeamId(): TeamId?
}
