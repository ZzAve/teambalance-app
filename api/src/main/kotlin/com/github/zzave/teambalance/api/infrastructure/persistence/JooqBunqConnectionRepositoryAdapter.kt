package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.BUNQ_CONNECTION
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.ZoneOffset

private const val SINGLETON_ID: Short = 1

@Repository
class JooqBunqConnectionRepositoryAdapter(
    private val dsl: DSLContext,
) : BunqConnectionRepository {

    override fun find(): BunqConnection? =
        dsl.selectFrom(BUNQ_CONNECTION)
            .where(BUNQ_CONNECTION.ID.eq(SINGLETON_ID))
            .fetchOne()
            ?.let {
                BunqConnection(
                    accountId = it.bunqAccountId?.let(::BunqAccountId),
                    grant = EncryptedToken(it.accessTokenEncrypted),
                    connectedBy = UserId(it.connectedBy),
                    connectedAt = it.connectedAt.toInstant(),
                )
            }

    override fun save(connection: BunqConnection) {
        val connectedAt = connection.connectedAt.atOffset(ZoneOffset.UTC)
        dsl.insertInto(BUNQ_CONNECTION)
            .set(BUNQ_CONNECTION.ID, SINGLETON_ID)
            .set(BUNQ_CONNECTION.BUNQ_ACCOUNT_ID, connection.accountId?.value)
            .set(BUNQ_CONNECTION.ACCESS_TOKEN_ENCRYPTED, connection.grant.value)
            .set(BUNQ_CONNECTION.CONNECTED_BY, connection.connectedBy.value)
            .set(BUNQ_CONNECTION.CONNECTED_AT, connectedAt)
            .onConflict(BUNQ_CONNECTION.ID)
            .doUpdate()
            .set(BUNQ_CONNECTION.BUNQ_ACCOUNT_ID, connection.accountId?.value)
            .set(BUNQ_CONNECTION.ACCESS_TOKEN_ENCRYPTED, connection.grant.value)
            .set(BUNQ_CONNECTION.CONNECTED_BY, connection.connectedBy.value)
            .set(BUNQ_CONNECTION.CONNECTED_AT, connectedAt)
            // The Bunq API session belongs to the grant it was made for, which this write replaces.
            .setNull(BUNQ_CONNECTION.API_CONTEXT_ENCRYPTED)
            .execute()
    }

    // Writes the account column of the row holding this grant and nothing else, so a disconnect or a
    // reconnect that landed since the grant was read is not undone.
    override fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken): Boolean =
        dsl.update(BUNQ_CONNECTION)
            .set(BUNQ_CONNECTION.BUNQ_ACCOUNT_ID, accountId.value)
            .where(BUNQ_CONNECTION.ID.eq(SINGLETON_ID))
            .and(BUNQ_CONNECTION.ACCESS_TOKEN_ENCRYPTED.eq(ifGrant.value))
            .execute() == 1

    override fun delete() {
        dsl.deleteFrom(BUNQ_CONNECTION).where(BUNQ_CONNECTION.ID.eq(SINGLETON_ID)).execute()
    }
}
