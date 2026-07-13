package com.github.zzave.teambalance.api.application

import java.util.UUID

interface CurrentTeamProvider {
    fun getCurrentTeamId(): UUID?
    fun requireCurrentTeamId(): UUID
}
