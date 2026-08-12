package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CreationCodeConsumedException
import com.github.zzave.teambalance.api.domain.exception.CreationCodeNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldMatch
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private class FakeGateway(private val admins: Set<UUID>) : PlatformAdminGateway {
    override fun isPlatformAdmin(userId: UUID) = userId in admins
    override fun requirePlatformAdmin(userId: UUID) {
        if (userId !in admins) throw NotPlatformAdminException(userId)
    }
}

private class FakeCodes(seed: List<TeamCreationCode> = emptyList()) : TeamCreationCodeRepository {
    val store = seed.associateBy { it.code }.toMutableMap()
    override fun isRedeemable(code: CreationCode, now: Instant) = store[code]?.let { it.consumedAt == null } ?: false
    override fun findAll() = store.values.sortedByDescending { it.createdAt }
    override fun findByCode(code: CreationCode) = store[code]
    override fun insert(code: CreationCode, createdAt: Instant, expiresAt: Instant?): TeamCreationCode =
        TeamCreationCode(code, createdAt, expiresAt, null, null, null).also { store[code] = it }
    override fun delete(code: CreationCode) {
        store.remove(code)
    }
}

class CreationCodeAdminServiceTest : FunSpec() {
    init {
        val admin = UserId(UUID.randomUUID())
        val outsider = UserId(UUID.randomUUID())
        val now = Instant.parse("2026-08-03T12:00:00Z")
        val clock = Clock.fixed(now, ZoneOffset.UTC)

        fun service(codes: FakeCodes) =
            CreationCodeAdminService(codes, FakeGateway(setOf(admin.value)), clock)

        test("create mints an unconsumed code stamped at the clock instant and returns it") {
            val codes = FakeCodes()
            val created = service(codes).create(admin, expiresAt = null)

            created.code.value.isNotBlank() shouldBe true
            created.createdAt shouldBe now
            created.expiresAt.shouldBeNull()
            created.consumedAt.shouldBeNull()
            codes.findByCode(created.code).shouldNotBeNull()
        }

        // The minting rule is the ONE format rule creation codes have, and it is a rule about the
        // *issuer*, not about the type: a code arriving on create-team is matched verbatim in SQL and
        // never re-checked against this shape (the e2e seed's 'E2E-CREATE-TEAM' does not match it).
        // Pinned here, at the mint site, because that is the only place it holds — and because the
        // unambiguous alphabet is a usability property (no 0/O/1/I in a code humans retype) and the
        // group count is the entropy budget (~60 bits) that makes guessing hopeless.
        test("create mints three dash-separated groups of four from the unambiguous alphabet") {
            val codes = FakeCodes()

            repeat(20) {
                service(codes).create(admin, expiresAt = null).code.value shouldMatch
                    Regex("[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}" +
                        "-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}")
            }
            // Distinct across mints — a fixed code would satisfy the shape but not the contract.
            codes.store.size shouldBe 20
        }

        test("create passes an explicit expiry through") {
            val expiry = Instant.parse("2099-01-01T00:00:00Z")
            service(FakeCodes()).create(admin, expiresAt = expiry).expiresAt shouldBe expiry
        }

        test("list returns all codes, newest first") {
            val old = TeamCreationCode(CreationCode("OLD"), now.minusSeconds(100), null, null, null, null)
            val new = TeamCreationCode(CreationCode("NEW"), now, null, null, null, null)
            val codes = FakeCodes(listOf(old, new))

            service(codes).list(admin).map { it.code } shouldContainExactly listOf(CreationCode("NEW"), CreationCode("OLD"))
        }

        test("revoking an unconsumed code deletes it") {
            val codes = FakeCodes(listOf(TeamCreationCode(CreationCode("C1"), now, null, null, null, null)))
            service(codes).revoke(admin, CreationCode("C1"))
            codes.findByCode(CreationCode("C1")).shouldBeNull()
        }

        test("revoking an unknown code throws not-found") {
            shouldThrow<CreationCodeNotFoundException> { service(FakeCodes()).revoke(admin, CreationCode("GHOST")) }
        }

        test("revoking a consumed code throws conflict and keeps it") {
            val consumed = TeamCreationCode(CreationCode("USED"), now, null, now, UserId.random(), null)
            val codes = FakeCodes(listOf(consumed))

            shouldThrow<CreationCodeConsumedException> { service(codes).revoke(admin, CreationCode("USED")) }
            codes.findByCode(CreationCode("USED")).shouldNotBeNull()
        }

        test("every operation is forbidden for a non-admin") {
            val codes = FakeCodes(listOf(TeamCreationCode(CreationCode("C1"), now, null, null, null, null)))
            val svc = service(codes)
            shouldThrow<NotPlatformAdminException> { svc.list(outsider) }
            shouldThrow<NotPlatformAdminException> { svc.create(outsider, null) }
            shouldThrow<NotPlatformAdminException> { svc.revoke(outsider, CreationCode("C1")) }
        }
    }
}
