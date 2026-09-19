package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SLUG
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_MEMBER
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldMatch
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import java.time.Instant

/**
 * The member-facing management of Calendar links (ADR-0032), against a real tenant schema — which is
 * where the rules that matter actually live: the cap counts rows in one team's schema, and ownership
 * is a predicate on a delete rather than a check somebody remembered to write.
 */
@AutoConfigureMockMvc
class CalendarLinkControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var calendarLinkTokens: CalendarLinkTokens

    private val json = ObjectMapper()

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("creating a link answers with a webcal URL naming the team and carrying the token") {
            createAs(ALPHA_MEMBER, label = "Phone")
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.label").value("Phone"))
                .andExpect(jsonPath("$.expired").value(false))
                .andReturn().urlOf() shouldMatch
                Regex("http://localhost:8080/api/calendar/$ALPHA_SLUG/[A-Za-z0-9_-]{43}\\.ics")
        }

        // The point of storing the token encrypted as well as hashed (ADR-0025's pattern): a member
        // who closes the dialog can come back to the URL they already put in their calendar.
        test("the same URL comes back on a later read, rather than being show-once") {
            val created = createAs(ALPHA_MEMBER).andExpect(status().isCreated).andReturn().urlOf()

            listAs(ALPHA_MEMBER)
                .andExpect(status().isOk)
                .andReturn().links().single()["url"] shouldBe created
        }

        test("a link created without a label simply has none") {
            createAs(ALPHA_MEMBER).andExpect(status().isCreated).andExpect(jsonPath("$.label").doesNotExist())
        }

        // Three otherwise identical URLs are indistinguishable without one, which is the whole job of
        // the label — so a blank one is no label rather than an empty string on screen.
        test("a blank label is treated as no label at all") {
            createAs(ALPHA_MEMBER, label = "   ").andExpect(status().isCreated)
                .andExpect(jsonPath("$.label").doesNotExist())
        }

        test("a member sees only their own links, not a teammate's") {
            createAs(ALPHA_MEMBER).andExpect(status().isCreated)

            listAs(CalendarLinkFixture.LEAVER).andExpect(status().isOk).andReturn().links().size shouldBe 0
        }

        context("three per member per team") {
            test("a fourth is refused, and says why") {
                repeat(3) { createAs(ALPHA_MEMBER).andExpect(status().isCreated) }

                createAs(ALPHA_MEMBER)
                    .andExpect(status().isConflict)
                    .andExpect(jsonPath("$.code").value("CALENDAR_LINK_LIMIT"))
            }

            // Expired rows count deliberately: otherwise the cap widens by itself over a year, and a
            // member could accumulate live links by outliving the old ones.
            test("an expired link still occupies a slot") {
                repeat(2) { createAs(ALPHA_MEMBER).andExpect(status().isCreated) }
                expiredLink()

                createAs(ALPHA_MEMBER).andExpect(status().isConflict)
            }

            test("an expired link is still listed, so the member can see what is in the way") {
                expiredLink()

                val listed = listAs(ALPHA_MEMBER).andExpect(status().isOk).andReturn().links().single()
                listed["expired"] shouldBe true
            }

            test("deleting one frees the slot") {
                repeat(3) { createAs(ALPHA_MEMBER).andExpect(status().isCreated) }
                val victim = listAs(ALPHA_MEMBER).andReturn().links().first()["id"] as String

                deleteAs(ALPHA_MEMBER, victim).andExpect(status().isNoContent)

                createAs(ALPHA_MEMBER).andExpect(status().isCreated)
            }
        }

        context("delete is scoped to the caller's own links") {
            test("deleting someone else's link is a 404, not a 403 - ids must not be probeable") {
                createAs(ALPHA_MEMBER).andExpect(status().isCreated)
                val theirs = listAs(ALPHA_MEMBER).andReturn().links().single()["id"] as String

                deleteAs(CalendarLinkFixture.LEAVER, theirs).andExpect(status().isNotFound)

                // And it really is still there.
                listAs(ALPHA_MEMBER).andReturn().links().size shouldBe 1
            }

            test("deleting a link that never existed is the same 404") {
                deleteAs(ALPHA_MEMBER, "00000000-0000-0000-0000-000000000000").andExpect(status().isNotFound)
            }
        }

        // The rows live in the team's own schema, so a member of two teams has two separate sets and
        // neither counts against the other's cap.
        test("links are scoped to the team they were created in") {
            createAs(ALPHA_MEMBER).andExpect(status().isCreated)

            listAs(BETA_MEMBER).andExpect(status().isOk).andReturn().links().size shouldBe 0
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    // The Wirespec handlers are suspend → the request dispatches asynchronously; complete it.
    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun createAs(userId: String, label: String? = null) = dispatch(
        MockMvcRequestBuilders.post("/api/calendar-links")
            .header("X-User-Id", userId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(label?.let { """{"label":"$it"}""" } ?: "{}"),
    )

    private fun listAs(userId: String) =
        dispatch(MockMvcRequestBuilders.get("/api/calendar-links").header("X-User-Id", userId))

    private fun deleteAs(userId: String, id: String) =
        dispatch(MockMvcRequestBuilders.delete("/api/calendar-links/$id").header("X-User-Id", userId))

    private fun expiredLink() = CalendarLinkFixture.link(
        jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, ALPHA_MEMBER,
        expiresAt = Instant.now().minusSeconds(60),
    )

    private fun org.springframework.test.web.servlet.MvcResult.urlOf(): String =
        json.readValue(response.contentAsString, Map::class.java)["url"] as String

    @Suppress("UNCHECKED_CAST")
    private fun org.springframework.test.web.servlet.MvcResult.links(): List<Map<String, Any?>> =
        json.readValue(response.contentAsString, Map::class.java)["links"] as List<Map<String, Any?>>
}
