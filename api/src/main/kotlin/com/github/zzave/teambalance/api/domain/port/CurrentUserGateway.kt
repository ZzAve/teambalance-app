package com.github.zzave.teambalance.api.domain.port

import java.util.UUID

interface CurrentUserGateway {
    fun getCurrentUserId(): UUID?
    fun requireCurrentUserId(): UUID
}
