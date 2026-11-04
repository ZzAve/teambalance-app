package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.MAGIC_LINK_TOKENS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.tables.records.MagicLinkTokensRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset
import java.util.UUID

@Repository
class JooqMagicLinkTokenRepositoryAdapter(
    private val dsl: DSLContext,
) : MagicLinkTokenRepository {

    override fun save(token: MagicLinkToken): MagicLinkToken {
        dsl.insertInto(MAGIC_LINK_TOKENS).set(token.toRecord()).execute()
        return token
    }

    override fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken? =
        dsl.selectFrom(MAGIC_LINK_TOKENS)
            .where(MAGIC_LINK_TOKENS.TOKEN_HASH.eq(tokenHash.value))
            .fetchOne()
            ?.toMagicLinkToken()

    // Conditional single-use consume: stamps used_at only while the token is still unused and unexpired
    // at the moment it is stamped (the caller's clock), so exactly one of two concurrent verifies of
    // the same link wins, and a link that lapsed after the service's check is not consumed. The loser
    // gets null and no user.
    @Transactional
    override fun consumeAndResolveUser(consumedToken: MagicLinkToken, displayName: DisplayName): User? {
        val usedAt = checkNotNull(consumedToken.usedAt) { "a consumed token carries its usedAt" }
            .atOffset(ZoneOffset.UTC)
        val consumed = dsl.update(MAGIC_LINK_TOKENS)
            .set(MAGIC_LINK_TOKENS.USED_AT, usedAt)
            .where(MAGIC_LINK_TOKENS.ID.eq(consumedToken.id))
            .and(MAGIC_LINK_TOKENS.USED_AT.isNull)
            .and(MAGIC_LINK_TOKENS.EXPIRES_AT.gt(usedAt))
            .execute()
        if (consumed == 0) return null

        // Insert-if-absent rather than look-up-then-insert: two first sign-ins for the same new email
        // (two links) resolve to the one user instead of the loser failing on the unique email.
        dsl.insertInto(USERS)
            .set(USERS.ID, UUID.randomUUID())
            .set(USERS.EMAIL, consumedToken.email.value)
            .set(USERS.DISPLAY_NAME, displayName.value)
            .onConflict(USERS.EMAIL)
            .doNothing()
            .execute()
        return dsl.selectFrom(USERS).where(USERS.EMAIL.eq(consumedToken.email.value)).fetchSingle().toUser()
    }
}

private fun MagicLinkToken.toRecord() = MagicLinkTokensRecord().also {
    it.id = id
    it.tokenHash = tokenHash.value
    it.email = email.value
    it.expiresAt = expiresAt.atOffset(ZoneOffset.UTC)
    it.usedAt = usedAt?.atOffset(ZoneOffset.UTC)
    it.createdAt = createdAt.atOffset(ZoneOffset.UTC)
    it.invitationId = invitationId
}

private fun MagicLinkTokensRecord.toMagicLinkToken() = MagicLinkToken(
    id = id,
    tokenHash = TokenHash(tokenHash),
    email = Email(email),
    expiresAt = expiresAt.toInstant(),
    usedAt = usedAt?.toInstant(),
    createdAt = createdAt.toInstant(),
    invitationId = invitationId,
)
