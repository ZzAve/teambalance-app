package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Passkey
import com.github.zzave.teambalance.api.domain.model.PasskeyId
import com.github.zzave.teambalance.api.domain.model.PasskeyLabel
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PasskeyRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.PASSKEYS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.tables.records.PasskeysRecord
import org.jooq.DSLContext
import org.springframework.security.web.webauthn.api.AuthenticatorTransport
import org.springframework.security.web.webauthn.api.Bytes
import org.springframework.security.web.webauthn.api.CredentialRecord
import org.springframework.security.web.webauthn.api.ImmutableCredentialRecord
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCose
import org.springframework.security.web.webauthn.api.PublicKeyCredentialType
import org.springframework.security.web.webauthn.management.UserCredentialRepository
import org.springframework.stereotype.Repository
import java.nio.ByteBuffer
import java.time.ZoneOffset
import java.util.UUID

/**
 * Passkeys in `public.passkeys` (ADR-0045). Is Spring Security's store for the ceremony and the
 * domain's read side for the Account tab.
 */
@Repository
class JooqPasskeyRepositoryAdapter(
    private val dsl: DSLContext,
) : UserCredentialRepository, PasskeyRepository {

    // Upsert: a sign-in saves the same credential again to bump its signature count and last-used time.
    override fun save(credentialRecord: CredentialRecord) {
        val row = credentialRecord.toRow()
        dsl.insertInto(PASSKEYS).set(row)
            .onConflict(PASSKEYS.CREDENTIAL_ID)
            .doUpdate()
            .set(PASSKEYS.SIGNATURE_COUNT, row.signatureCount)
            .set(PASSKEYS.BACKUP_STATE, row.backupState)
            .set(PASSKEYS.UV_INITIALIZED, row.uvInitialized)
            .set(PASSKEYS.LAST_USED_AT, row.lastUsedAt)
            .execute()
    }

    override fun findByCredentialId(credentialId: Bytes): CredentialRecord? =
        dsl.selectFrom(PASSKEYS).where(PASSKEYS.CREDENTIAL_ID.eq(credentialId.bytes)).fetchOne()?.toRecord()

    override fun findByUserId(userId: Bytes): List<CredentialRecord> =
        dsl.selectFrom(PASSKEYS).where(PASSKEYS.USER_ID.eq(userId.userUuid())).fetch().map { it.toRecord() }

    override fun delete(credentialId: Bytes) {
        dsl.deleteFrom(PASSKEYS).where(PASSKEYS.CREDENTIAL_ID.eq(credentialId.bytes)).execute()
    }

    override fun findAllFor(userId: UserId): List<Passkey> =
        dsl.selectFrom(PASSKEYS).where(PASSKEYS.USER_ID.eq(userId.value)).orderBy(PASSKEYS.CREATED_AT).fetch().map {
            Passkey(
                id = PasskeyId(Bytes(it.credentialId).toBase64UrlString()),
                label = PasskeyLabel(it.label),
                createdAt = it.createdAt.toInstant(),
                lastUsedAt = it.lastUsedAt?.toInstant(),
            )
        }

    override fun countFor(userId: UserId): Int = dsl.fetchCount(PASSKEYS, PASSKEYS.USER_ID.eq(userId.value))
}

private const val LABEL_MAX = 100

private fun CredentialRecord.toRow() = PasskeysRecord().also {
    it.credentialId = credentialId.bytes
    it.userId = userEntityUserId.userUuid()
    it.credentialType = checkNotNull(credentialType) { "a credential record has a type" }.value
    it.publicKey = publicKey.bytes
    it.signatureCount = signatureCount
    it.uvInitialized = isUvInitialized
    it.backupEligible = isBackupEligible
    it.backupState = isBackupState
    it.transports = transports.map { transport -> transport.value }.toTypedArray()
    it.attestationObject = checkNotNull(attestationObject) { "a stored credential has its attestation object" }.bytes
    it.attestationClientDataJson = attestationClientDataJSON?.bytes
    // The label comes from the client; the column is VARCHAR(100).
    it.label = label.take(LABEL_MAX)
    it.createdAt = checkNotNull(created) { "a credential record has a creation time" }.atOffset(ZoneOffset.UTC)
    // Spring's builder stamps lastUsed = now on a new record; a passkey nobody signed in with has none.
    it.lastUsedAt = lastUsed?.takeUnless { it == created }?.atOffset(ZoneOffset.UTC)
}

private fun PasskeysRecord.toRecord(): CredentialRecord = ImmutableCredentialRecord.builder()
    .credentialType(PublicKeyCredentialType.valueOf(credentialType))
    .credentialId(Bytes(credentialId))
    .userEntityUserId(userHandle(userId))
    .publicKey(ImmutablePublicKeyCose(publicKey))
    .signatureCount(signatureCount)
    .uvInitialized(uvInitialized)
    .backupEligible(backupEligible)
    .backupState(backupState)
    .transports(transports.map { AuthenticatorTransport.valueOf(it) }.toSet())
    .attestationObject(Bytes(attestationObject))
    .attestationClientDataJSON(attestationClientDataJson?.let(::Bytes))
    .label(label)
    .created(createdAt.toInstant())
    .apply { lastUsedAt?.let { lastUsed(it.toInstant()) } }
    .build()

// The WebAuthn user handle of a user is the 16 bytes of their id (the user entity adapter in `identity` maps the same way).
private fun Bytes.userUuid() = ByteBuffer.wrap(bytes).let { UUID(it.long, it.long) }

private fun userHandle(userId: UUID) =
    Bytes(ByteBuffer.allocate(Long.SIZE_BYTES * 2).putLong(userId.mostSignificantBits).putLong(userId.leastSignificantBits).array())
