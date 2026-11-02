package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.infrastructure.bunq.FakeBunqGatewayAdapter
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant
import java.util.UUID

private const val CONNECTION = "/api/team/money-pool/connection"

/** With `connect-enabled` off (the default everywhere but dev and test), the whole feature is unreachable over HTTP. */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.bunq.connect-enabled=false"])
class BunqConnectDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var states: BunqOAuthStateRepository

    @Autowired
    lateinit var fakeBunq: FakeBunqGatewayAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest {
            jdbcTemplate.update("DELETE FROM $ALPHA_SCHEMA.bunq_connection")
            jdbcTemplate.update("DELETE FROM public.bunq_oauth_states WHERE team_id = ?::uuid", ALPHA_TEAM)
        }

        test("starting a connection is a 404 for an admin, and no state is stored") {
            api(post(CONNECTION)).andExpect(status().isNotFound)

            stateRows() shouldBe 0
        }

        test("the status says connecting is unavailable") {
            api(get(CONNECTION))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.connectAvailable").value(false))
                .andExpect(jsonPath("$.connected").value(false))
        }

        // With a real code Bunq would accept, the only thing standing between this callback and a connection
        // is the flag: the state must stay unspent too, since a callback with connecting off does nothing at all.
        test("a callback with a live state and a code Bunq would accept connects nothing and spends nothing") {
            val state = UUID.randomUUID().toString()
            states.save(
                BunqOAuthState(
                    id = UUID.randomUUID(),
                    tokenHash = TokenHash.unsalted(state),
                    teamId = TeamId(UUID.fromString(ALPHA_TEAM)),
                    adminUserId = UserId(UUID.fromString(ALPHA_MEMBER)),
                    expiresAt = Instant.now().plusSeconds(600),
                    usedAt = null,
                    createdAt = Instant.now(),
                ),
            )
            val code = fakeBunq.issueCode("flag-off-login")

            mockMvc.perform(get("/api/bunq/oauth/callback").param("state", state).param("code", code).with(loginAs(ALPHA_MEMBER)))
                .andExpect(status().isFound)
                .andExpect(header().string("Location", "http://localhost:5173/t/cal-alpha/team/settings?bunq=error"))

            jdbcTemplate.queryForObject("SELECT count(*) FROM $ALPHA_SCHEMA.bunq_connection", Int::class.java) shouldBe 0
            unspentStateRows() shouldBe 1
        }
    }

    private fun stateRows() =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.bunq_oauth_states WHERE team_id = ?::uuid", Int::class.java, ALPHA_TEAM,
        )!!

    private fun unspentStateRows() =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.bunq_oauth_states WHERE team_id = ?::uuid AND used_at IS NULL",
            Int::class.java, ALPHA_TEAM,
        )!!

    /** The wirespec handlers are suspend functions, so every answer arrives through an async dispatch. */
    private fun api(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder.with(loginAs(ALPHA_MEMBER)))
            .andExpect(request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(asyncDispatch(it)) }
}
