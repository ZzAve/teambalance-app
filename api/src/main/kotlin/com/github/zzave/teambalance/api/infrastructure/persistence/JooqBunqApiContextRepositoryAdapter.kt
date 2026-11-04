package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.BUNQ_CONNECTION
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

private const val SINGLETON_ID: Short = 1

/**
 * Outside a tenant scope there is no connection row, and the tenant-routed connection would fail the query (it routes to a
 * schema that does not exist), so both calls answer "none" there. That is the Admin connecting: the callback names no team
 * until it has entered one.
 */
@Repository
class JooqBunqApiContextRepositoryAdapter(
    private val dsl: DSLContext,
    private val currentTeam: CurrentTeamGateway,
) : BunqApiContextRepository {

    override fun find(): StoredBunqApiContext? =
        if (inTenantScope()) {
            dsl.select(BUNQ_CONNECTION.ACCESS_TOKEN_ENCRYPTED, BUNQ_CONNECTION.API_CONTEXT_ENCRYPTED)
                .from(BUNQ_CONNECTION)
                .where(BUNQ_CONNECTION.ID.eq(SINGLETON_ID))
                .fetchOne()
                ?.let { StoredBunqApiContext(EncryptedToken(it.value1()), it.value2()?.let(::EncryptedToken)) }
        } else {
            null
        }

    // Writes the session column of the row that still holds this grant and nothing else, so a session made for a grant that a
    // reconnect has replaced since is not stored over the cleared column.
    override fun save(context: EncryptedToken, ifGrant: EncryptedToken): Boolean =
        inTenantScope() &&
            dsl.update(BUNQ_CONNECTION)
                .set(BUNQ_CONNECTION.API_CONTEXT_ENCRYPTED, context.value)
                .where(BUNQ_CONNECTION.ID.eq(SINGLETON_ID))
                .and(BUNQ_CONNECTION.ACCESS_TOKEN_ENCRYPTED.eq(ifGrant.value))
                .execute() == 1

    /** The team is resolved together with the tenant schema, so a team means the schema is routed. */
    private fun inTenantScope() = currentTeam.findCurrentTeamId() != null
}
