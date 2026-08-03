package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.UserId

interface CurrentUserGateway {
    fun getCurrentUserId(): UserId?
    fun requireCurrentUserId(): UserId
}
