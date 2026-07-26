package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

// Merged with the inherited "test" profile from TeamBalanceIT (inheritProfiles).
@ActiveProfiles("e2e")
@AutoConfigureMockMvc
class E2eSupportIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    init {
        test("e2e profile provisions the team_test schema and seeds team, user and membership") {
            val schemaCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM information_schema.schemata WHERE schema_name = 'team_test'",
                Int::class.java,
            )
            schemaCount shouldBe 1

            val membershipCount = jdbcTemplate.queryForObject(
                """
                SELECT count(*) FROM public.team_members tm
                JOIN public.teams t ON t.id = tm.team_id
                JOIN public.users u ON u.id = tm.user_id
                WHERE t.schema_name = 'team_test' AND u.email = 'e2e@example.com'
                """,
                Int::class.java,
            )
            membershipCount shouldBe 1
        }

        test("e2e profile seeds a future event with an attendance row for the e2e user") {
            val eventCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM team_test.events WHERE title = 'E2E Training' AND start_time > now()",
                Int::class.java,
            )
            eventCount shouldBe 1

            val attendanceCount = jdbcTemplate.queryForObject(
                """
                SELECT count(*) FROM team_test.attendances a
                JOIN team_test.events e ON e.id = a.event_id
                JOIN public.users u ON u.id = a.user_id
                WHERE e.title = 'E2E Training' AND u.email = 'e2e@example.com'
                """,
                Int::class.java,
            )
            attendanceCount shouldBe 1
        }

        test("plaintext magic-link token is retrievable via the e2e endpoint and verifies") {
            val email = "e2e@example.com"

            val (_, requested) = performAsync(
                MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"email":"$email"}"""),
            )
            requested.andExpect(MockMvcResultMatchers.status().isAccepted)

            val tokenResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/internal/e2e/magic-link-token").param("email", email),
            )
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").isString)
                .andReturn()
            val token = ObjectMapper().readTree(tokenResult.response.contentAsString)["token"].asText()

            val (_, verified) = performAsync(
                MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"token":"$token"}"""),
            )
            verified.andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(email))
        }

        // Guards the seed ↔ domain-model contract: a fixture row the Event mapper can't
        // internalize (e.g. NULL end_time) 500s here instead of only failing the slow e2e.
        test("seeded tenant data is servable through the events API as the e2e user") {
            val email = "e2e@example.com"

            val (_, requested) = performAsync(
                MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"email":"$email"}"""),
            )
            requested.andExpect(MockMvcResultMatchers.status().isAccepted)

            val tokenResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/internal/e2e/magic-link-token").param("email", email),
            ).andReturn()
            val token = ObjectMapper().readTree(tokenResult.response.contentAsString)["token"].asText()

            val (_, verified) = performAsync(
                MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"token":"$token"}"""),
            )
            verified.andExpect(MockMvcResultMatchers.status().isOk)
            // Session identity is carried by the Spring Session cookie, not a heap-resident
            // HttpSession, so thread the cookie into the follow-up request to stay authenticated.
            val session = verified.andReturn().response.cookies.first()

            // Query params must be in the URI: the Wirespec adapter parses the raw query string,
            // which MockMvc's .param() does not populate.
            val (_, events) = performAsync(
                MockMvcRequestBuilders.get("/api/events?include-past=false").cookie(session),
            )
            events.andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[?(@.title == 'E2E Training')]").exists())
        }

        test("e2e token endpoint returns 404 for an email without a requested token") {
            mockMvc.perform(
                MockMvcRequestBuilders.get("/internal/e2e/magic-link-token").param("email", "nobody@example.com"),
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }

    private fun performAsync(builder: MockHttpServletRequestBuilder): Pair<MvcResult, ResultActions> {
        val started = mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        return started to mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }
}
