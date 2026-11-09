package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Passkey
import com.github.zzave.teambalance.api.domain.model.UserId

interface PasskeyRepository {
    /** The user's passkeys, oldest first. */
    fun findAllFor(userId: UserId): List<Passkey>

    fun countFor(userId: UserId): Int
}
