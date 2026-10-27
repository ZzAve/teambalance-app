package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

private const val RACERS = 8

/** The single-use guarantee of the Bunq OAuth state lives in one conditional UPDATE; this is its test. */
class JpaBunqOAuthStateRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var states: BunqOAuthStateRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest {
            jdbcTemplate.update("DELETE FROM public.bunq_oauth_states WHERE team_id = ?::uuid", CalendarLinkFixture.ALPHA_TEAM)
        }

        test("consuming a state works once, then never again") {
            val state = saved()

            states.consume(state.id, Instant.now()) shouldBe true
            states.consume(state.id, Instant.now()) shouldBe false
        }

        test("of several callbacks racing on one state exactly one wins") {
            val state = saved()
            val start = CountDownLatch(1)
            val pool = Executors.newFixedThreadPool(RACERS)
            try {
                val results = (1..RACERS).map {
                    pool.submit<Boolean> {
                        start.await()
                        states.consume(state.id, Instant.now())
                    }
                }
                start.countDown()

                results.map { it.get(30, TimeUnit.SECONDS) }.count { it } shouldBe 1
            } finally {
                pool.shutdownNow()
            }
        }
    }

    private fun saved(): BunqOAuthState {
        val state = BunqOAuthState(
            id = UUID.randomUUID(),
            tokenHash = TokenHash.unsalted(UUID.randomUUID().toString()),
            teamId = TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM)),
            adminUserId = UserId(UUID.fromString(CalendarLinkFixture.ALPHA_MEMBER)),
            expiresAt = Instant.now().plusSeconds(600),
            usedAt = null,
            createdAt = Instant.now(),
        )
        states.save(state)
        return state
    }
}
