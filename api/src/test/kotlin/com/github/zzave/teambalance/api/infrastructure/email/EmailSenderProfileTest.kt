package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.EmailSender
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import org.springframework.web.client.RestClient

/**
 * Magic link is the entire login path, so the prod profile MUST select the real
 * Scaleway TEM sender and every other profile the console (no-send) sender.
 */
class EmailSenderProfileTest : FunSpec({

    fun runnerFor(profile: String) = ApplicationContextRunner()
        .withInitializer { it.environment.setActiveProfiles(profile) }
        .withBean(RestClient.Builder::class.java, { RestClient.builder() })
        .withUserConfiguration(ScalewayTemEmailSender::class.java, ConsoleEmailSender::class.java)
        .withPropertyValues(
            "teambalance.frontend-base-url=https://app.teambalance.nl",
            "teambalance.email.from-name=TeamBalance",
            "teambalance.email.from-address=login@teambalance.nl",
            "teambalance.email.api-key=test-key",
            "teambalance.email.project-id=test-project",
            "teambalance.email.region=fr-par",
        )

    test("prod profile selects the Scaleway TEM sender") {
        runnerFor("prod").run { ctx ->
            ctx.getBean(EmailSender::class.java).shouldBeInstanceOf<ScalewayTemEmailSender>()
        }
    }

    test("dev profile selects the console sender") {
        runnerFor("dev").run { ctx ->
            ctx.getBean(EmailSender::class.java).shouldBeInstanceOf<ConsoleEmailSender>()
        }
    }
})
