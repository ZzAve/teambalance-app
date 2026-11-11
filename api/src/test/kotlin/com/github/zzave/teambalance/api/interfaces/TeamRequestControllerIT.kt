package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.longs.shouldBeInRange
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.sql.Timestamp
import java.time.Duration
import java.time.Instant
import java.util.UUID

// The admin allowlist in application-test.yml holds `team-requests-admin@test.com`.
@AutoConfigureMockMvc
class TeamRequestControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var mails: FakeEmailGateway

    private val admin = "ee000000-0000-0000-0000-000000000001"
    private val json = ObjectMapper()

    private fun seedUser(id: String, email: String, language: String? = null) {
        tenantSchemaAdapter.provisionPlatformSchema()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name, language) VALUES (?::uuid, ?, ?, ?) " +
                "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email",
            id,
            email,
            "User $email",
            language,
        )
    }

    private class Requester(val id: String, val email: String)

    private fun newRequester(language: String? = null): Requester {
        val id = UUID.randomUUID().toString()
        val email = "req-$id@test.com"
        seedUser(id, email, language)
        return Requester(id, email)
    }

    // The Wirespec handlers are suspend, so the request dispatches asynchronously; complete it.
    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun post(path: String, userId: String, body: String = "{}") = dispatch(
        MockMvcRequestBuilders.post(path).with(loginAs(userId)).contentType(MediaType.APPLICATION_JSON).content(body),
    )

    private fun submit(userId: String, name: String = "Spikers", purpose: String = "Our volleyball team") =
        post("/api/team-requests", userId, """{"teamName":"$name","purpose":"$purpose"}""")

    private fun idOf(result: ResultActions): String =
        json.readTree(result.andReturn().response.contentAsString)["id"].asText()

    private fun mailsTo(address: String) = mails.renderedTeamRequestMails.filter { it.first == address }.map { it.second }

    init {
        beforeTest { seedUser(admin, "team-requests-admin@test.com") }

        test("submit stores a pending request, mails the admins in Dutch and the requester a receipt") {
            val user = newRequester(language = "en")

            val id = idOf(
                submit(user.id, name = "  Spikers  ")
                    .andExpect(MockMvcResultMatchers.status().isCreated)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("PENDING"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.teamName").value("Spikers"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.creationCode").doesNotExist()),
            )

            jdbcTemplate.queryForObject(
                "SELECT status || '/' || team_name FROM public.team_requests WHERE id = ?::uuid",
                String::class.java,
                id,
            ) shouldBe "PENDING/Spikers"
            val adminMail = mailsTo("team-requests-admin@test.com").last { it.text.contains(user.email) }
            adminMail.subject shouldBe "Teamaanvraag 'Spikers' van ${user.email}"
            adminMail.text shouldContain "Our volleyball team"
            adminMail.text shouldContain "http://localhost/admin/creation-codes"
            mailsTo(user.email).single().subject shouldBe "We received your request for Spikers"
        }

        test("a second submit while one is pending is a 409; after a reject the user may submit again") {
            val user = newRequester()
            val first = idOf(submit(user.id).andExpect(MockMvcResultMatchers.status().isCreated))

            submit(user.id)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("TEAM_REQUEST_PENDING"))

            post("/api/admin/team-requests/$first/reject", admin).andExpect(MockMvcResultMatchers.status().isOk)
            submit(user.id, name = "Again").andExpect(MockMvcResultMatchers.status().isCreated)
        }

        test("an invalid name or purpose is a 400 with a field code") {
            val user = newRequester()
            submit(user.id, name = " ")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_NAME"))
            submit(user.id, purpose = " ")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_PURPOSE"))
        }

        test("mine is 404 with no request, then returns the latest one") {
            val user = newRequester()
            dispatch(MockMvcRequestBuilders.get("/api/team-requests/mine").with(loginAs(user.id)))
                .andExpect(MockMvcResultMatchers.status().isNotFound)

            submit(user.id)
            dispatch(MockMvcRequestBuilders.get("/api/team-requests/mine").with(loginAs(user.id)))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("PENDING"))
        }

        test("approve mints a code that expires in 30 days, links it and mails the link in the requester's language") {
            val user = newRequester(language = "en")
            val id = idOf(submit(user.id, name = "Net & Co"))

            val before = Instant.now()
            post("/api/admin/team-requests/$id/approve", admin)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("APPROVED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.creationCode").isString)

            val row = jdbcTemplate.queryForMap(
                "SELECT c.code, c.expires_at, c.consumed_at FROM public.team_requests r " +
                    "JOIN public.team_creation_codes c ON c.id = r.creation_code_id WHERE r.id = ?::uuid",
                id,
            )
            val expiresAt = (row["expires_at"] as Timestamp).toInstant()
            Duration.between(before, expiresAt).toDays() shouldBeInRange 29L..30L
            row["consumed_at"] shouldBe null
            val mail = mailsTo(user.email).last()
            mail.subject shouldBe "Your request for Net & Co is approved"
            mail.text shouldContain "http://localhost/create-team?code=${row["code"]}&name=Net+%26+Co"

            // Approving a decided request is a 409.
            post("/api/admin/team-requests/$id/approve", admin).andExpect(MockMvcResultMatchers.status().isConflict)
        }

        test("reject mails the reason, or none, in Dutch when the requester has no stored language") {
            val withReason = newRequester()
            val reasonId = idOf(submit(withReason.id))
            post("/api/admin/team-requests/$reasonId/reject", admin, """{"reason":"Not now"}""")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("REJECTED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.rejectReason").value("Not now"))
            mailsTo(withReason.email).last().text shouldContain "Reden: Not now"

            val without = newRequester()
            val plainId = idOf(submit(without.id))
            post("/api/admin/team-requests/$plainId/reject", admin)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.rejectReason").doesNotExist())
            val plain = mailsTo(without.email).last()
            plain.subject shouldBe "Je aanvraag voor Spikers is niet goedgekeurd"
            (plain.text.contains("Reden")) shouldBe false

            post("/api/admin/team-requests/$plainId/reject", admin).andExpect(MockMvcResultMatchers.status().isConflict)
        }

        test("a reason over 500 characters is a 400; an unknown request is a 404") {
            val user = newRequester()
            val id = idOf(submit(user.id))
            post("/api/admin/team-requests/$id/reject", admin, """{"reason":"${"a".repeat(501)}"}""")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            post("/api/admin/team-requests/${UUID.randomUUID()}/approve", admin)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("the admin list holds the pending request with the requester's email") {
            val user = newRequester()
            val id = idOf(submit(user.id))
            dispatch(MockMvcRequestBuilders.get("/api/admin/team-requests").with(loginAs(admin)))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.requests[?(@.id == '$id')].requesterEmail").value(user.email))
        }

        test("a plain user is forbidden from every admin endpoint, an anonymous caller is unauthorized") {
            val user = newRequester()
            val id = idOf(submit(user.id))
            dispatch(MockMvcRequestBuilders.get("/api/admin/team-requests").with(loginAs(user.id)))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
            post("/api/admin/team-requests/$id/approve", user.id).andExpect(MockMvcResultMatchers.status().isForbidden)
            post("/api/admin/team-requests/$id/reject", user.id).andExpect(MockMvcResultMatchers.status().isForbidden)

            mockMvc.perform(MockMvcRequestBuilders.get("/api/admin/team-requests"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
            mockMvc.perform(MockMvcRequestBuilders.get("/api/team-requests/mine"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }
}
