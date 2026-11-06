package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.infrastructure.bunq.RealBunqGatewayAdapter
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import java.util.UUID

/**
 * The pure `prod` profile with `TEAMBALANCE_BUNQ_CONNECT_ENABLED=true` on top of the production Bunq environment, the
 * last step of switching Bunq on in prod: the app starts and connecting is no longer refused. The real adapter is only
 * wired here, never called. Test values only. The other combinations (prod with the sandbox or no Bunq environment)
 * refuse to start; a context that fails to start cannot be asserted from a [TeamBalanceIT], so that refusal is proven
 * in [BunqConnectConfigTest].
 */
@ActiveProfiles("prod", inheritProfiles = false)
@TestPropertySource(
    properties = [
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=prod-smoke-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.bunq.environment=production",
        "teambalance.bunq.client-id=prod-smoke-client-id",
        "teambalance.bunq.client-secret=prod-smoke-client-secret",
        "teambalance.bunq.connect-enabled=true",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
        "teambalance.internal.api-key=prod-smoke-internal-key",
        "info.build.sha=smoke-sha",
    ],
)
class ProdProfileBunqConnectEnabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var applicationContext: ApplicationContext

    init {
        test("prod with the production Bunq environment and connecting on starts with the real adapter") {
            applicationContext.getBean(BunqGateway::class.java).shouldBeInstanceOf<RealBunqGatewayAdapter>()
        }

        test("connecting is on: a caller who is no Admin of the team is turned away as such, not as connecting being disabled") {
            val service = applicationContext.getBean(BunqConnectionService::class.java)

            // The admin check comes before the gateway, so Bunq is never called.
            shouldThrow<NotTeamAdminException> { service.start(UserId.random(), TeamId(UUID.randomUUID())) }
        }
    }
}
