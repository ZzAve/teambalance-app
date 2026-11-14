package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

// Namespaced after ADR-0048, for the reason RosterFillIT gives: every IT shares one `public` schema.
private const val ADMIN_USER_ID = "00480000-0000-0000-0000-000000000001"
private const val MEMBER_USER_ID = "00480000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/** The Bulletin Board end to end (ADR-0048): real rows in the tenant, and who may write them. */
@AutoConfigureMockMvc
class BulletinIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeEach {
            seedTeam()
            jdbcTemplate.update("DELETE FROM public.bulletin_posts")
        }

        test("an admin posts and a member reads the posts newest first, with the author") {
            post("### Ball bag rotation\n- Week 46 — Lisa", ADMIN_USER_ID)
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.authorId").value(ADMIN_USER_ID))
            post("Clubhouse closes at **22:30**", ADMIN_USER_ID).andExpect(status().isCreated)

            perform(MockMvcRequestBuilders.get("/api/bulletin-posts"), MEMBER_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.posts.length()").value(2))
                .andExpect(jsonPath("$.posts[0].markdown").value("Clubhouse closes at **22:30**"))
                .andExpect(jsonPath("$.posts[1].markdown").value("### Ball bag rotation\n- Week 46 — Lisa"))
                .andExpect(jsonPath("$.posts[1].authorId").value(ADMIN_USER_ID))
        }

        test("a member who is not an admin may not post") {
            post("Not mine to post", MEMBER_USER_ID).andExpect(status().isForbidden)

            perform(MockMvcRequestBuilders.get("/api/bulletin-posts"), MEMBER_USER_ID)
                .andExpect(jsonPath("$.posts.length()").value(0))
        }

        test("a blank post is refused") {
            post("   ", ADMIN_USER_ID).andExpect(status().isBadRequest)
        }
    }

    private fun post(markdown: String, asUser: String) =
        perform(
            MockMvcRequestBuilders.post("/api/bulletin-posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"markdown": ${jsonString(markdown)}}"""),
            asUser,
        )

    private fun jsonString(value: String) = "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\""

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.with(loginAs(userId, tenant = "public")))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        seedMember(ADMIN_USER_ID, "bulletin-admin@test.com", role = "ADMIN")
        seedMember(MEMBER_USER_ID, "bulletin-member@test.com", role = "USER")
    }

    private fun seedMember(userId: String, email: String, role: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', NULL)")
    }
}
