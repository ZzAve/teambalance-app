package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqConnection

/** The current tenant's Bunq connection, if the team has connected one. */
interface BunqConnectionRepository {
    fun find(): BunqConnection?
}
