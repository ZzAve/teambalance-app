package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeUsers(private val byId: Map<UUID, User>) : UserRepository {
    override fun findById(id: UserId): User? = byId[id.value]
    override fun findByEmail(email: Email): User? = byId.values.firstOrNull { it.email == email }
    override fun save(user: User): User = user
    override fun findLastActiveTeamId(userId: UserId): TeamId? = null
    override fun rememberActiveTeam(userId: UserId, teamId: TeamId) = Unit
}

class PlatformAdminGatewayAdapterTest : FunSpec() {
    init {
        val adminId = UUID.randomUUID()
        val plainId = UUID.randomUUID()
        val admin = User(UserId(adminId), Email("admin@teambalance.nl"), DisplayName("Admin"))
        val plain = User(UserId(plainId), Email("someone@example.com"), DisplayName("Someone"))
        val users = FakeUsers(mapOf(adminId to admin, plainId to plain))

        fun guard(allowlist: List<String>) = PlatformAdminGatewayAdapter(users, PlatformAdminAllowlist(allowlist))

        test("isPlatformAdmin is true for an allowlisted email, case-insensitively") {
            guard(listOf("Admin@TeamBalance.NL")).isPlatformAdmin(adminId) shouldBe true
        }

        test("isPlatformAdmin is false for a non-allowlisted user") {
            guard(listOf("admin@teambalance.nl")).isPlatformAdmin(plainId) shouldBe false
        }

        test("empty allowlist is fail-closed — nobody is a platform admin") {
            guard(emptyList()).isPlatformAdmin(adminId) shouldBe false
        }

        test("unknown user id is fail-closed") {
            guard(listOf("admin@teambalance.nl")).isPlatformAdmin(UUID.randomUUID()) shouldBe false
        }

        test("requirePlatformAdmin passes for an allowlisted caller in context") {
            UserContext.set(adminId)
            try {
                shouldNotThrowAny { guard(listOf("admin@teambalance.nl")).requirePlatformAdmin() }
            } finally {
                UserContext.clear()
            }
        }

        test("requirePlatformAdmin throws 403 for a non-admin caller in context") {
            UserContext.set(plainId)
            try {
                shouldThrow<NotPlatformAdminException> { guard(listOf("admin@teambalance.nl")).requirePlatformAdmin() }
            } finally {
                UserContext.clear()
            }
        }
    }
}
