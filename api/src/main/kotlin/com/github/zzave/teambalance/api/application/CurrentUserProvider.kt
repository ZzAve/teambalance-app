package com.github.zzave.teambalance.api.application

import java.util.UUID

interface CurrentUserProvider {
    fun getCurrentUserId(): UUID?
    fun requireCurrentUserId(): UUID
}
