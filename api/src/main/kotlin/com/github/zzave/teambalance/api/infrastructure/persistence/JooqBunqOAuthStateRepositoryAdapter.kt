package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.BUNQ_OAUTH_STATES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

@Repository
class JooqBunqOAuthStateRepositoryAdapter(
    private val dsl: DSLContext,
) : BunqOAuthStateRepository {

    override fun save(state: BunqOAuthState) {
        val stateHash = state.tokenHash.value
        val expiresAt = state.expiresAt.atOffset(ZoneOffset.UTC)
        val usedAt = state.usedAt?.atOffset(ZoneOffset.UTC)
        dsl.insertInto(BUNQ_OAUTH_STATES)
            .set(BUNQ_OAUTH_STATES.ID, state.id)
            .set(BUNQ_OAUTH_STATES.STATE_HASH, stateHash)
            .set(BUNQ_OAUTH_STATES.TEAM_ID, state.teamId.value)
            .set(BUNQ_OAUTH_STATES.ADMIN_USER_ID, state.adminUserId.value)
            .set(BUNQ_OAUTH_STATES.EXPIRES_AT, expiresAt)
            .set(BUNQ_OAUTH_STATES.USED_AT, usedAt)
            .set(BUNQ_OAUTH_STATES.CREATED_AT, state.createdAt.atOffset(ZoneOffset.UTC))
            .onConflict(BUNQ_OAUTH_STATES.ID)
            .doUpdate()
            .set(BUNQ_OAUTH_STATES.STATE_HASH, stateHash)
            .set(BUNQ_OAUTH_STATES.TEAM_ID, state.teamId.value)
            .set(BUNQ_OAUTH_STATES.ADMIN_USER_ID, state.adminUserId.value)
            .set(BUNQ_OAUTH_STATES.EXPIRES_AT, expiresAt)
            .set(BUNQ_OAUTH_STATES.USED_AT, usedAt)
            .execute()
    }

    override fun findByTokenHash(tokenHash: TokenHash): BunqOAuthState? =
        dsl.selectFrom(BUNQ_OAUTH_STATES)
            .where(BUNQ_OAUTH_STATES.STATE_HASH.eq(tokenHash.value))
            .fetchOne()
            ?.let {
                BunqOAuthState(
                    id = it.id,
                    tokenHash = TokenHash(it.stateHash),
                    teamId = TeamId(it.teamId),
                    adminUserId = UserId(it.adminUserId),
                    expiresAt = it.expiresAt.toInstant(),
                    usedAt = it.usedAt?.toInstant(),
                    createdAt = it.createdAt.toInstant(),
                )
            }

    // Conditional single-use consume: stamps used_at only while still unused, so exactly one callback
    // per state wins.
    @Transactional
    override fun consume(id: UUID, now: Instant): Boolean =
        dsl.update(BUNQ_OAUTH_STATES)
            .set(BUNQ_OAUTH_STATES.USED_AT, now.atOffset(ZoneOffset.UTC))
            .where(BUNQ_OAUTH_STATES.ID.eq(id))
            .and(BUNQ_OAUTH_STATES.USED_AT.isNull)
            .execute() == 1

    @Transactional
    override fun deleteExpiredBefore(cutoff: Instant) {
        dsl.deleteFrom(BUNQ_OAUTH_STATES)
            .where(BUNQ_OAUTH_STATES.EXPIRES_AT.lt(cutoff.atOffset(ZoneOffset.UTC)))
            .execute()
    }
}
