package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

private val TEAM = TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM))
private val ADMIN = UserId(UUID.fromString(CalendarLinkFixture.ALPHA_MEMBER))

/**
 * Every call here runs with no tenant set, as an invitation accept does for a user who has no team yet:
 * the `public.invitations` statements must work without a tenant schema, inside `@Transactional` too.
 */
class JooqInvitationRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var invitations: InvitationRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest { jdbcTemplate.update("DELETE FROM public.invitations WHERE team_id = ?::uuid", CalendarLinkFixture.ALPHA_TEAM) }

        test("a saved invitation reads back by hash and by id, including a consumed ADMIN link") {
            val spent = invitation(Role.ADMIN).copy(consumedAt = now().plusSeconds(1))
            invitations.save(spent)

            invitations.findByTokenHash(spent.tokenHash) shouldBe spent
            invitations.findById(spent.id) shouldBe spent
        }

        test("a link without a recoverable token keeps it null") {
            val legacy = invitation(Role.USER).copy(encryptedToken = null)
            invitations.save(legacy)

            invitations.findById(legacy.id) shouldBe legacy
        }

        test("consuming a link in a transaction with no tenant works once, then never again") {
            val link = invitation(Role.ADMIN)
            invitations.save(link)

            invitations.consume(link.id, now()) shouldBe true
            invitations.consume(link.id, now()) shouldBe false
        }

        test("expiring one role leaves the other role's live link alone") {
            val user = invitation(Role.USER)
            val admin = invitation(Role.ADMIN)
            invitations.save(user)
            invitations.save(admin)

            invitations.expireActive(TEAM, Role.USER, now())

            invitations.findActiveByTeam(TEAM, now()) shouldBe null
            invitations.findActiveAdminByTeam(TEAM, now()) shouldBe admin
        }

        test("rotating replaces the live link of that role with the new one") {
            invitations.save(invitation(Role.USER))
            val replacement = invitation(Role.USER)

            invitations.rotate(TEAM, replacement, now()) shouldBe replacement

            invitations.findActiveByTeam(TEAM, now()) shouldBe replacement
        }

        test("an ADMIN link that was consumed is no longer the active handover link") {
            val link = invitation(Role.ADMIN)
            invitations.save(link)
            invitations.consume(link.id, now())

            invitations.findActiveAdminByTeam(TEAM, now()) shouldBe null
        }
    }

    // Microsecond precision, because that is what the column stores.
    private fun now(): Instant = Instant.now().truncatedTo(ChronoUnit.MICROS)

    private fun invitation(role: Role) = Invitation(
        id = UUID.randomUUID(),
        teamId = TEAM,
        role = role,
        consumedAt = null,
        tokenHash = TokenHash.unsalted(UUID.randomUUID().toString()),
        encryptedToken = EncryptedToken("sealed-${UUID.randomUUID()}"),
        createdBy = ADMIN,
        expiresAt = now().plus(1, ChronoUnit.DAYS),
        createdAt = now(),
    )
}
