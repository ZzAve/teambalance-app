package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import tools.jackson.databind.json.JsonMapper

private const val OTHER_SCHEMA = "team_demo_iso_other"
private const val OTHER_TEAM_ID = "a0000000-0000-0000-0000-0000000000d1"
private const val EVENT_ID = "d0000000-0000-0000-0000-000000000031"

/**
 * The guest login end to end through the real filter chain: the seeded persona gets a normal session whose tenant is
 * pinned to the demo team, and nothing it does reaches another team's schema. The XSRF cookie is renamed, as in
 * the demo container, which also proves the renamed cookie round-trips.
 */
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.csrf.cookie-name=DEMO-XSRF-TOKEN",
    ],
)
class DemoSessionIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var json: JsonMapper

    init {
        test("the seeder created the persona, the membership and one event, with the literals DemoPersona holds") {
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.users WHERE id = ?::uuid AND email = 'sanne@demo.teambalance.nl'",
                Int::class.java,
                DemoPersona.MEMBER.userId.value.toString(),
            ) shouldBe 1
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
                Int::class.java,
                DemoPersona.TEAM_ID.value.toString(),
                DemoPersona.MEMBER.userId.value.toString(),
            ) shouldBe 1
            jdbcTemplate.queryForObject(
                "SELECT schema_name FROM public.teams WHERE id = ?::uuid and slug = ?",
                String::class.java,
                DemoPersona.TEAM_ID.value.toString(),
                DemoPersona.SLUG,
            ) shouldBe DemoPersona.SCHEMA
            jdbcTemplate.queryForObject("SELECT count(*) FROM ${DemoPersona.SCHEMA}.events", Int::class.java) shouldBe 1
        }

        test("a visitor with no cookie gets a session that lands on the demo team as a plain member") {
            val session = createSession()

            val me = json.readTree(perform(get("/api/auth/me").cookie(session)).contentAsString)
            me["activeTeam"]["slug"].asString() shouldBe DemoPersona.SLUG
            me["role"].asString() shouldBe "USER"
            me["isPlatformAdmin"].asBoolean() shouldBe false
            (me["actAs"]?.isNull ?: true) shouldBe true
        }

        test("the session reads the demo team's events and never another team's") {
            tenantSchemaAdapter.provisionTenantSchema(OTHER_SCHEMA)
            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$OTHER_TEAM_ID'::uuid, 'Other', 'demo-iso-other', '$OTHER_SCHEMA')
                ON CONFLICT DO NOTHING
                """,
            )
            jdbcTemplate.execute(
                """
                INSERT INTO $OTHER_SCHEMA.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES (gen_random_uuid(), (SELECT id FROM $OTHER_SCHEMA.event_types WHERE name = 'Training'),
                    'Other team only', now() + interval '2 days', now() + interval '2 days 2 hours',
                    '${DemoPersona.MEMBER.userId.value}'::uuid, now(), now())
                """,
            )

            val list = perform(get("/api/events?include-past=false").cookie(createSession()))
            list.status shouldBe 200
            list.contentAsString shouldContain "\"title\":\"Training\""
            list.contentAsString shouldNotContain "Other team only"
        }

        test("the session can answer an event, and the answer lands in the demo schema only") {
            val session = createSession()
            val xsrf = perform(get("/api/auth/me").cookie(session)).getCookie("DEMO-XSRF-TOKEN").shouldNotBeNull()

            val response = perform(
                put("/api/events/$EVENT_ID/attendances/${DemoPersona.MEMBER.userId.value}")
                    .cookie(session, xsrf)
                    .header("X-XSRF-TOKEN", xsrf.value)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"state":"ATTENDING"}"""),
            )

            response.status shouldBe 200
            jdbcTemplate.queryForObject(
                """
                SELECT count(*) FROM ${DemoPersona.SCHEMA}.attendances
                WHERE event_id IN (SELECT id FROM ${DemoPersona.SCHEMA}.events WHERE uuid = ?::uuid)
                """,
                Int::class.java,
                EVENT_ID,
            ) shouldBe 1
            jdbcTemplate.queryForObject("SELECT count(*) FROM $OTHER_SCHEMA.attendances", Int::class.java) shouldBe 0
        }

        test("an unknown persona is refused with 400 and no session") {
            val response = createSessionResponse("COACH")

            response.status shouldBe 400
            response.getCookie("SESSION") shouldBe null
        }

        test("the coach persona is the demo team's admin, and only there") {
            val me = json.readTree(perform(get("/api/auth/me").cookie(createSession("ADMIN"))).contentAsString)
            me["activeTeam"]["slug"].asString() shouldBe DemoPersona.SLUG
            me["role"].asString() shouldBe "ADMIN"
            me["isPlatformAdmin"].asBoolean() shouldBe false
            me["teams"].size() shouldBe 1
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE user_id = ?::uuid AND team_id <> ?::uuid",
                Int::class.java,
                DemoPersona.ADMIN.userId.value.toString(),
                DemoPersona.TEAM_ID.value.toString(),
            ) shouldBe 0
        }

        test("an admin-only route answers the coach and refuses the player") {
            perform(get("/api/team/money-pool/settings").cookie(createSession("ADMIN"))).status shouldBe 200
            perform(get("/api/team/money-pool/settings").cookie(createSession("MEMBER"))).status shouldBe 403
        }

        test("every guest login starts a new session") {
            createSession().value shouldNotBe createSession().value
        }
    }

    private fun createSession(persona: String = "MEMBER"): Cookie = createSessionResponse(persona).also { it.status shouldBe 204 }
        .getCookie("SESSION").shouldNotBeNull()

    // No cookie, no CSRF token: the first request a visitor's browser makes.
    private fun createSessionResponse(persona: String) = perform(
        post("/api/demo/session").contentType(MediaType.APPLICATION_JSON).content("""{"persona":"$persona"}"""),
    )

    private fun perform(builder: MockHttpServletRequestBuilder): MockHttpServletResponse {
        val started = mockMvc.perform(builder).andReturn()
        return if (started.request.isAsyncStarted) {
            mockMvc.perform(asyncDispatch(started)).andReturn().response
        } else {
            started.response
        }
    }
}
