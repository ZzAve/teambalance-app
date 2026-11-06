package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.application.legacyEncrypt
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import java.sql.Timestamp
import java.time.Instant
import java.util.Base64
import java.util.UUID

private const val SCHEMA = "link_aad_migration"
private val TEAM = TeamId(UUID.fromString("a4650000-0000-0000-0000-000000000001"))
private const val USER = "a4650000-0000-0000-0000-0000000000ad"

/**
 * Issue #465: the invite and calendar links stored without AAD are re-encrypted at startup for their team (and a
 * calendar link for its own id). Values already bound, or bound to something else, are left as they are.
 */
class LinkTokenAadMigrationIT : TeamBalanceIT() {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var migration: LinkTokenAadMigration

    @Autowired
    @Qualifier(LinkTokenAadMigration.INVITATION_TOKEN_CIPHER)
    lateinit var invitationCipher: TokenCipher

    @Autowired
    lateinit var calendarLinkTokens: CalendarLinkTokens

    @Value("\${teambalance.invitation.token-encryption-key}")
    lateinit var invitationKey: String

    @Value("\${teambalance.calendar-link.token-encryption-key}")
    lateinit var calendarKey: String

    init {
        beforeTest {
            jdbcTemplate.execute("DROP SCHEMA IF EXISTS $SCHEMA CASCADE")
            jdbcTemplate.update("DELETE FROM public.invitations WHERE team_id = ?", TEAM.value)
            jdbcTemplate.update("DELETE FROM public.teams WHERE id = ?", TEAM.value)
            tenantSchemaAdapter.provisionTenantSchema(SCHEMA)
            CalendarLinkFixture.team(jdbcTemplate, TEAM.value.toString(), "AAD Migration", "aad-migration", SCHEMA)
            CalendarLinkFixture.user(jdbcTemplate, USER, "aad-migration@test.com", "AAD Migration")
        }

        test("a link stored without AAD opens for its team after the migration, and not without AAD") {
            val invite = invitation(legacyEncrypt(decode(invitationKey), "legacy-invite"))
            val link = CalendarLinkId.random()
            calendarLink(link, legacyEncrypt(decode(calendarKey), "legacy-calendar"))

            migration.migrate()

            invitationCipher.decrypt(invitationToken(invite), TokenCipher.aadOf(TEAM, Purpose.INVITE_LINK)) shouldBe "legacy-invite"
            calendarLinkTokens.reveal(calendarToken(link), TEAM, link).value shouldBe "legacy-calendar"
        }

        test("running it again changes nothing") {
            val invite = invitation(legacyEncrypt(decode(invitationKey), "legacy-invite"))
            val link = CalendarLinkId.random()
            calendarLink(link, legacyEncrypt(decode(calendarKey), "legacy-calendar"))
            migration.migrate()
            val afterFirst = invitationToken(invite) to calendarToken(link)

            migration.migrate()

            (invitationToken(invite) to calendarToken(link)) shouldBe afterFirst
        }

        test("a value already bound to its row, or bound to another team, is left as it is") {
            val bound = invitationCipher.encrypt("bound", TokenCipher.aadOf(TEAM, Purpose.INVITE_LINK))
            val foreign = invitationCipher.encrypt("foreign", TokenCipher.aadOf(TeamId(UUID.randomUUID()), Purpose.INVITE_LINK))
            val boundInvite = invitation(bound)
            val foreignInvite = invitation(foreign)
            val link = CalendarLinkId.random()
            val boundLink = calendarLinkTokens.conceal(CalendarToken("bound-calendar"), TEAM, link)
            calendarLink(link, boundLink)

            migration.migrate()

            invitationToken(boundInvite) shouldBe bound
            invitationToken(foreignInvite) shouldBe foreign
            calendarToken(link) shouldBe boundLink
        }
    }

    private fun decode(key: String) = Base64.getDecoder().decode(key.trim())

    private fun invitation(encrypted: EncryptedToken): UUID {
        val id = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.invitations (id, team_id, token, token_encrypted, created_by, expires_at) VALUES (?, ?, ?, ?, ?::uuid, ?)",
            id, TEAM.value, "hash-$id", encrypted.value, USER, Timestamp.from(Instant.now().plusSeconds(3600)),
        )
        return id
    }

    private fun calendarLink(id: CalendarLinkId, encrypted: EncryptedToken) {
        jdbcTemplate.update(
            "INSERT INTO $SCHEMA.calendar_links (id, user_id, token_hash, token_encrypted, expires_at) VALUES (?, ?::uuid, ?, ?, ?)",
            id.value, USER, "hash-${id.value}".take(64), encrypted.value, Timestamp.from(Instant.now().plusSeconds(3600)),
        )
    }

    private fun invitationToken(id: UUID) = EncryptedToken(
        jdbcTemplate.queryForObject("SELECT token_encrypted FROM public.invitations WHERE id = ?", String::class.java, id)!!,
    )

    private fun calendarToken(id: CalendarLinkId) = EncryptedToken(
        jdbcTemplate.queryForObject("SELECT token_encrypted FROM $SCHEMA.calendar_links WHERE id = ?", String::class.java, id.value)!!,
    )
}
