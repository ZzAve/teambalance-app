package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.util.UUID

private const val ADMIN_USER_ID = "c0000000-0000-0000-0000-000000000011"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000011"
private const val TEAM_SCHEMA = "team_carry"

// Must match application-test.yml (teambalance.invitation.token-salt).
private const val TEST_SALT = "test-invitation-salt"

/**
 * Joining a team must survive the magic-link email being opened somewhere the invite page was never
 * loaded (#342).
 *
 * The invite used to be carried between `/invite/:token` and the emailed `/auth/verify` in the
 * joiner's `localStorage`. That is per browser profile, not per person: opening the email on a laptop
 * after tapping the link on a phone, or in Safari after tapping it in WhatsApp's in-app browser, lost
 * it, and the joiner landed signed in with no team. The server never heard about the invite at all,
 * so it could not repair it.
 *
 * These tests hold the property that replaces it. Each request here is its own MockMvc call carrying
 * no cookie and no client state, so the two halves of the flow share **only the emailed token** —
 * the same thing, and the only thing, that reaches a different browser. A carry that leaned on
 * anything client-side could not pass.
 *
 * The invite rides as a reference on the magic-link record rather than inside the emailed URL. A
 * magic link is single-use and short-lived; an Invite Link is reusable and lives until an admin
 * rotates it, so putting the token in the email would have left a long-lived join credential in every
 * joiner's mailbox. What the columns hold is asserted here too, because that is the security property,
 * not an implementation detail.
 */
@AutoConfigureMockMvc
@Import(MagicLinkInviteCarryIT.TestConfig::class)
class MagicLinkInviteCarryIT : TeamBalanceIT() {

    @TestConfiguration
    class TestConfig {
        @Bean
        @Primary
        fun emailGateway(): EmailGateway = FakeEmailGateway()
    }

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var fakeEmailGateway: FakeEmailGateway

    init {
        test("an invite requested on one device is applied when the emailed link is opened on another") {
            seedTeam()
            val inviteToken = "invite-${UUID.randomUUID()}"
            val invitationId = seedInvitation(inviteToken)
            val email = "carry-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, inviteToken).andExpect(MockMvcResultMatchers.status().isAccepted)

            // The record remembers the invitation; the emailed URL carries only the login token.
            pendingInvitationOf(email) shouldBe invitationId

            // A different browser: nothing but the token crosses over.
            val magicLinkToken = lastEmailedToken(email)
            verify(magicLinkToken)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.inviteOutcome").value("JOINED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.user.email").value(email))

            isMemberOfTeam(email) shouldBe true
        }

        // Refusing at request time is what lets the invite page say so while the joiner is still
        // looking at it, rather than after an email round trip that ends on a teamless hub.
        test("a magic link requested with an expired invite is refused, and no email is sent") {
            seedTeam()
            val inviteToken = "expired-${UUID.randomUUID()}"
            seedInvitation(inviteToken, expiresAt = "2000-01-01T00:00:00Z")
            val email = "dead-invite-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, inviteToken).andExpect(MockMvcResultMatchers.status().isNotFound)

            fakeEmailGateway.sentMagicLinks.none { it.first.value == email } shouldBe true
            tokenRowCount(email) shouldBe 0
        }

        // Amends ADR-0008's accept ordering. Withholding the session would strand the joiner for good,
        // since re-clicking a dead invite cannot help, and signed-in-but-teamless now has an
        // onboarding hub of its own to land on.
        test("an invite rotated away after the email was sent still signs the joiner in, reported unavailable") {
            seedTeam()
            val inviteToken = "rotated-${UUID.randomUUID()}"
            seedInvitation(inviteToken)
            val email = "rotated-joiner-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, inviteToken).andExpect(MockMvcResultMatchers.status().isAccepted)
            val magicLinkToken = lastEmailedToken(email)

            // The admin rotates the link in the minutes before the joiner opens their mail.
            expireAllInvitations()

            verify(magicLinkToken)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.inviteOutcome").value("UNAVAILABLE"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.user.email").value(email))

            isMemberOfTeam(email) shouldBe false
        }

        test("an ordinary sign-in records no pending invite and reports no outcome") {
            val email = "plain-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, inviteToken = null).andExpect(MockMvcResultMatchers.status().isAccepted)

            pendingInvitationOf(email) shouldBe null
            verify(lastEmailedToken(email))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.inviteOutcome").doesNotExist())
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun requestMagicLink(email: String, inviteToken: String?): ResultActions {
        val body = if (inviteToken == null) {
            """{"email":"$email"}"""
        } else {
            """{"email":"$email","inviteToken":"$inviteToken"}"""
        }
        val (_, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        )
        return dispatched
    }

    /** Deliberately cookie-less: this stands in for the click arriving from a different browser. */
    private fun verify(magicLinkToken: String): ResultActions {
        val (_, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$magicLinkToken"}"""),
        )
        return dispatched
    }

    private fun lastEmailedToken(email: String): String =
        fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        // Its own tenant schema, not `public`. `teams.schema_name` is UNIQUE, and these ITs share one
        // Postgres, so a team borrowing another class's schema name is silently swallowed by the
        // ON CONFLICT and every later insert then fails on a team that does not exist.
        tenantSchemaAdapter.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Carry Team', 'carry-team', '$TEAM_SCHEMA') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$ADMIN_USER_ID'::uuid, 'carry-admin@test.com', 'Carry Admin') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')",
        )
    }

    /** Inserted directly rather than minted, so the test controls the expiry. Returns its id. */
    private fun seedInvitation(plaintextToken: String, expiresAt: String = "2099-01-01T00:00:00Z"): UUID {
        expireAllInvitations()
        return jdbcTemplate.queryForObject(
            "INSERT INTO public.invitations (team_id, token, created_by, expires_at) " +
                "VALUES (?::uuid, ?, ?::uuid, ?::timestamptz) RETURNING id",
            UUID::class.java,
            TEAM_ID,
            sha256Hex(TEST_SALT, plaintextToken),
            ADMIN_USER_ID,
            expiresAt,
        )!!
    }

    // One Postgres is shared across these tests with no truncation between them, so a link left live
    // by an earlier one would still resolve. Tests that care start from none.
    private fun expireAllInvitations() {
        jdbcTemplate.update(
            "UPDATE public.invitations SET expires_at = now() WHERE team_id = ?::uuid AND expires_at > now()",
            TEAM_ID,
        )
    }

    private fun pendingInvitationOf(email: String): UUID? =
        jdbcTemplate.queryForObject(
            "SELECT invitation_id FROM public.magic_link_tokens WHERE email = ? ORDER BY created_at DESC LIMIT 1",
            UUID::class.java,
            email,
        )

    private fun tokenRowCount(email: String): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.magic_link_tokens WHERE email = ?",
            Long::class.java,
            email,
        )!!

    private fun isMemberOfTeam(email: String): Boolean =
        jdbcTemplate.queryForObject(
            "SELECT EXISTS(SELECT 1 FROM public.team_members m JOIN public.users u ON u.id = m.user_id " +
                "WHERE m.team_id = ?::uuid AND u.email = ?)",
            Boolean::class.java,
            TEAM_ID,
            email,
        )!!

    private fun performAsync(builder: MockHttpServletRequestBuilder): Pair<MvcResult, ResultActions> {
        val started = mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        return started to mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    private fun sha256Hex(salt: String, token: String): String =
        MessageDigest.getInstance("SHA-256").digest((salt + token).toByteArray())
            .joinToString("") { "%02x".format(it) }
}
