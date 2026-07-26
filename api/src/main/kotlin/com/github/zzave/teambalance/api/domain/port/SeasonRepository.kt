package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Season

/**
 * Reads and writes the current tenant's season window. The tenant is resolved from the request
 * context (Hibernate multitenancy), so this port takes no team argument — it always operates on
 * the singleton settings row of the active schema.
 */
interface SeasonRepository {
    fun get(): Season
    fun save(season: Season): Season
}
