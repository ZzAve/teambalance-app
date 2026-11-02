package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.INVITATIONS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.tables.records.InvitationsRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

@Repository
class JooqInvitationRepositoryAdapter(
    private val dsl: DSLContext,
) : InvitationRepository {

    override fun save(invitation: Invitation): Invitation = upsert(invitation)

    override fun findByTokenHash(tokenHash: TokenHash): Invitation? =
        dsl.selectFrom(INVITATIONS).where(INVITATIONS.TOKEN.eq(tokenHash.value)).fetchOne()?.toInvitation()

    override fun findById(invitationId: UUID): Invitation? =
        dsl.selectFrom(INVITATIONS).where(INVITATIONS.ID.eq(invitationId)).fetchOne()?.toInvitation()

    override fun findActiveByTeam(teamId: TeamId, now: Instant): Invitation? =
        dsl.selectFrom(INVITATIONS)
            .where(INVITATIONS.TEAM_ID.eq(teamId.value))
            .and(INVITATIONS.ROLE.eq(Role.USER.name))
            .and(INVITATIONS.EXPIRES_AT.gt(now.atOffset(ZoneOffset.UTC)))
            .limit(1)
            .fetchOne()
            ?.toInvitation()

    override fun findActiveAdminByTeam(teamId: TeamId, now: Instant): Invitation? =
        dsl.selectFrom(INVITATIONS)
            .where(INVITATIONS.TEAM_ID.eq(teamId.value))
            .and(INVITATIONS.ROLE.eq(Role.ADMIN.name))
            .and(INVITATIONS.CONSUMED_AT.isNull)
            .and(INVITATIONS.EXPIRES_AT.gt(now.atOffset(ZoneOffset.UTC)))
            .limit(1)
            .fetchOne()
            ?.toInvitation()

    // Conditional single-use consume: stamps consumed_at only while still unspent, so exactly one
    // accept of an ADMIN handover link can win.
    @Transactional
    override fun consume(invitationId: UUID, now: Instant): Boolean =
        dsl.update(INVITATIONS)
            .set(INVITATIONS.CONSUMED_AT, now.atOffset(ZoneOffset.UTC))
            .where(INVITATIONS.ID.eq(invitationId))
            .and(INVITATIONS.CONSUMED_AT.isNull)
            .execute() == 1

    @Transactional
    override fun expireActive(teamId: TeamId, role: Role, now: Instant) {
        expireActiveByRole(teamId, role, now)
    }

    @Transactional
    override fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation {
        // Expire only the links of the same role we are about to reissue, so a USER rotate leaves a
        // live ADMIN handover link untouched (and vice-versa).
        expireActiveByRole(teamId, replacement.role, now)
        return upsert(replacement)
    }

    // Scoped by role: the USER and ADMIN links are independent credentials (ADR-0024 §5), each
    // rotated/revoked on its own path.
    private fun expireActiveByRole(teamId: TeamId, role: Role, now: Instant) {
        val cutoff = now.atOffset(ZoneOffset.UTC)
        dsl.update(INVITATIONS)
            .set(INVITATIONS.EXPIRES_AT, cutoff)
            .where(INVITATIONS.TEAM_ID.eq(teamId.value))
            .and(INVITATIONS.ROLE.eq(role.name))
            .and(INVITATIONS.EXPIRES_AT.gt(cutoff))
            .execute()
    }

    private fun upsert(invitation: Invitation): Invitation {
        val record = invitation.toRecord()
        dsl.insertInto(INVITATIONS)
            .set(record)
            .onConflict(INVITATIONS.ID)
            .doUpdate()
            .set(record)
            .execute()
        return invitation
    }
}

private fun Invitation.toRecord() = InvitationsRecord().also {
    it.id = id
    it.teamId = teamId.value
    it.token = tokenHash.value
    it.tokenEncrypted = encryptedToken?.value
    it.role = role.name
    it.consumedAt = consumedAt?.atOffset(ZoneOffset.UTC)
    it.createdBy = createdBy.value
    it.expiresAt = expiresAt.atOffset(ZoneOffset.UTC)
    it.createdAt = createdAt.atOffset(ZoneOffset.UTC)
}

private fun InvitationsRecord.toInvitation() = Invitation(
    id = id,
    teamId = TeamId(teamId),
    role = Role.valueOf(role),
    consumedAt = consumedAt?.toInstant(),
    tokenHash = TokenHash(token),
    encryptedToken = tokenEncrypted?.let(::EncryptedToken),
    createdBy = UserId(createdBy),
    expiresAt = expiresAt.toInstant(),
    createdAt = createdAt.toInstant(),
)
