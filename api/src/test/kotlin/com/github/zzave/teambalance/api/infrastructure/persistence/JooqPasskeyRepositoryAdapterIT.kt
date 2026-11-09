package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.PasskeyId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.web.webauthn.api.AuthenticatorTransport
import org.springframework.security.web.webauthn.api.Bytes
import org.springframework.security.web.webauthn.api.CredentialRecord
import org.springframework.security.web.webauthn.api.ImmutableCredentialRecord
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCose
import org.springframework.security.web.webauthn.api.PublicKeyCredentialType
import java.nio.ByteBuffer
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

private val OWNER = UUID.fromString("e0000000-0000-0000-0000-0000000000a1")
private val OTHER = UUID.fromString("e0000000-0000-0000-0000-0000000000a2")

class JooqPasskeyRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var passkeys: JooqPasskeyRepositoryAdapter

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun handle(user: UUID) =
        Bytes(ByteBuffer.allocate(16).putLong(user.mostSignificantBits).putLong(user.leastSignificantBits).array())

    private fun record(
        id: Byte,
        user: UUID = OWNER,
        label: String = "This device",
        signatureCount: Long = 0,
        created: Instant = Instant.parse("2026-01-01T10:00:00Z"),
    ): CredentialRecord = ImmutableCredentialRecord.builder()
        .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
        .credentialId(Bytes(byteArrayOf(id, 2, 3)))
        .userEntityUserId(handle(user))
        .publicKey(ImmutablePublicKeyCose(byteArrayOf(9, 8, 7)))
        .signatureCount(signatureCount)
        .uvInitialized(true)
        .backupEligible(true)
        .backupState(false)
        .transports(setOf(AuthenticatorTransport.INTERNAL, AuthenticatorTransport.HYBRID))
        .attestationObject(Bytes(byteArrayOf(5, 5)))
        .attestationClientDataJSON(Bytes(byteArrayOf(6)))
        .label(label)
        .created(created)
        // As Spring's builder does for a new record.
        .lastUsed(created)
        .build()

    init {
        beforeTest {
            tenantSchemaAdapter.provisionPlatformSchema()
            jdbcTemplate.execute("DELETE FROM public.passkeys")
            listOf(OWNER, OTHER).forEachIndexed { i, id ->
                jdbcTemplate.execute(
                    "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, 'passkey-it-$i@test.com', 'Passkey $i') " +
                        "ON CONFLICT (id) DO NOTHING",
                )
            }
        }

        test("a saved record reads back with every field") {
            val saved = record(1)
            passkeys.save(saved)

            val read = passkeys.findByCredentialId(saved.credentialId)!!
            read.credentialType shouldBe PublicKeyCredentialType.PUBLIC_KEY
            read.userEntityUserId shouldBe saved.userEntityUserId
            read.publicKey.bytes shouldBe saved.publicKey.bytes
            read.signatureCount shouldBe 0
            read.isUvInitialized shouldBe true
            read.isBackupEligible shouldBe true
            read.isBackupState shouldBe false
            read.transports shouldBe saved.transports
            read.attestationObject shouldBe saved.attestationObject
            read.attestationClientDataJSON shouldBe saved.attestationClientDataJSON
            read.label shouldBe "This device"
            read.created shouldBe saved.created
        }

        test("saving the same credential again updates it instead of failing") {
            val first = record(1)
            passkeys.save(first)
            val used = Instant.parse("2026-02-01T10:00:00Z").truncatedTo(ChronoUnit.MICROS)
            passkeys.save(ImmutableCredentialRecord.fromCredentialRecord(first).signatureCount(7).lastUsed(used).build())

            val read = passkeys.findByCredentialId(first.credentialId)!!
            read.signatureCount shouldBe 7
            read.lastUsed shouldBe used
        }

        test("a label longer than the column is cut instead of failing the save") {
            passkeys.save(record(1, label = "x".repeat(300)))

            passkeys.findByCredentialId(Bytes(byteArrayOf(1, 2, 3)))!!.label shouldBe "x".repeat(100)
        }

        test("a new passkey has never been used; a sign-in marks it used") {
            val saved = record(1)
            passkeys.save(saved)
            passkeys.findAllFor(UserId(OWNER)).single().lastUsedAt shouldBe null

            passkeys.save(ImmutableCredentialRecord.fromCredentialRecord(saved).lastUsed(Instant.parse("2026-02-01T10:00:00Z")).build())
            passkeys.findAllFor(UserId(OWNER)).single().lastUsedAt shouldBe Instant.parse("2026-02-01T10:00:00Z")
        }

        test("findByUserId returns only that user's records") {
            passkeys.save(record(1))
            passkeys.save(record(2, user = OTHER))

            passkeys.findByUserId(handle(OWNER)).map { it.credentialId } shouldContainExactly listOf(Bytes(byteArrayOf(1, 2, 3)))
        }

        test("delete removes the record, and deleting the user removes their records") {
            passkeys.save(record(1))
            passkeys.save(record(2, user = OTHER))

            passkeys.delete(Bytes(byteArrayOf(1, 2, 3)))
            passkeys.findByCredentialId(Bytes(byteArrayOf(1, 2, 3))) shouldBe null

            jdbcTemplate.update("DELETE FROM public.users WHERE id = ?", OTHER)
            passkeys.findByUserId(handle(OTHER)).shouldBeEmpty()
        }

        test("findAllFor lists base64url ids oldest first, and countFor counts them") {
            passkeys.countFor(UserId(OWNER)) shouldBe 0
            passkeys.save(record(2, label = "Newer", created = Instant.parse("2026-03-01T10:00:00Z")))
            passkeys.save(record(1, label = "Older"))

            val listed = passkeys.findAllFor(UserId(OWNER))
            listed.map { it.label.value } shouldContainExactly listOf("Older", "Newer")
            listed.map { it.id } shouldContainExactly listOf(
                PasskeyId(Bytes(byteArrayOf(1, 2, 3)).toBase64UrlString()),
                PasskeyId(Bytes(byteArrayOf(2, 2, 3)).toBase64UrlString()),
            )
            passkeys.countFor(UserId(OWNER)) shouldBe 2

            passkeys.delete(Bytes(byteArrayOf(1, 2, 3)))
            passkeys.delete(Bytes(byteArrayOf(2, 2, 3)))
            passkeys.countFor(UserId(OWNER)) shouldBe 0
        }
    }
}
