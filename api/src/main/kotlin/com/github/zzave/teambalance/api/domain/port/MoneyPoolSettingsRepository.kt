package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings

/** The current tenant's money pool switch; the tenant is resolved from the request context. */
interface MoneyPoolSettingsRepository {
    fun get(): MoneyPoolSettings
}
