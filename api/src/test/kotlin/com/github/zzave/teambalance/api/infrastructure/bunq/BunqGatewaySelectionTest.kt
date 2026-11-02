package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.port.BunqGateway
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.boot.autoconfigure.AutoConfigurations
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import org.springframework.context.annotation.Bean
import org.springframework.core.env.SystemEnvironmentPropertySource
import java.time.Clock

private const val CLIENT_ID = "selection-test-client-id"
private const val CLIENT_SECRET = "selection-test-client-secret"

private fun messagesOf(failure: Throwable?) = generateSequence(failure) { it.cause }.joinToString(" | ") { it.message.orEmpty() }

/**
 * Which [BunqGateway] each profile and `teambalance.bunq.environment` wires, with application.yml loaded for real.
 * The prod choice is made in a factory method and not by a condition, because Spring AOT fixes conditions when the
 * image is built, where the environment is not set; the production run of the image shows it in a live container.
 */
class BunqGatewaySelectionTest : FunSpec({

    fun runner(profile: String) = ApplicationContextRunner()
        .withInitializer(ConfigDataApplicationContextInitializer())
        .withConfiguration(AutoConfigurations.of(PropertyPlaceholderAutoConfiguration::class.java))
        .withUserConfiguration(
            SelectionTestBeans::class.java,
            BunqGatewayConfiguration::class.java,
            FakeBunqGatewayAdapter::class.java,
            FakeBunqAuthorizeController::class.java,
        )
        .withPropertyValues("spring.profiles.active=$profile")

    fun credentials(environment: String) = arrayOf(
        "teambalance.bunq.environment=$environment",
        "teambalance.bunq.client-id=$CLIENT_ID",
        "teambalance.bunq.client-secret=$CLIENT_SECRET",
    )

    context("outside prod") {
        test("without a Bunq environment the fake Bunq and its approval page are wired") {
            runner("dev").run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBean(BunqGateway::class.java).shouldBeInstanceOf<FakeBunqGatewayAdapter>()
                ctx.getBeansOfType(FakeBunqAuthorizeController::class.java).size shouldBe 1
            }
        }

        test("the sandbox environment wires the real adapter instead, with no fake approval page") {
            runner("dev").withPropertyValues(*credentials("sandbox")).run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBean(BunqGateway::class.java).shouldBeInstanceOf<RealBunqGatewayAdapter>()
                ctx.getBeanNamesForType(FakeBunqGatewayAdapter::class.java).toList().shouldBeEmpty()
                ctx.getBeanNamesForType(FakeBunqAuthorizeController::class.java).toList().shouldBeEmpty()
            }
        }
    }

    context("in prod") {
        test("without a Bunq environment the unconfigured gateway is wired") {
            runner("prod").run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBean(BunqGateway::class.java).shouldBeInstanceOf<UnconfiguredBunqGatewayAdapter>()
            }
        }

        test("the production environment wires the real adapter on the public OAuth server") {
            runner("prod").withPropertyValues(*credentials("production")).run { ctx ->
                ctx.startupFailure.shouldBeNull()
                val gateway = ctx.getBean(BunqGateway::class.java).shouldBeInstanceOf<RealBunqGatewayAdapter>()
                gateway.authorizationUrl("s", "https://api.example/cb") shouldStartWith "https://oauth.bunq.com/auth?"
            }
        }

        test("the sandbox environment wires the real adapter on the sandbox OAuth server") {
            runner("prod").withPropertyValues(*credentials("sandbox")).run { ctx ->
                val gateway = ctx.getBean(BunqGateway::class.java).shouldBeInstanceOf<RealBunqGatewayAdapter>()
                gateway.authorizationUrl("s", "https://api.example/cb") shouldStartWith "https://oauth.sandbox.bunq.com/auth?"
            }
        }
    }

    context("the environment value") {
        test("TEAMBALANCE_BUNQ_ENVIRONMENT, TEAMBALANCE_BUNQ_CLIENT_ID and TEAMBALANCE_BUNQ_CLIENT_SECRET reach the properties") {
            runner("prod")
                .withInitializer { ctx ->
                    ctx.environment.propertySources.addFirst(
                        SystemEnvironmentPropertySource(
                            "systemEnvironment",
                            mapOf(
                                "TEAMBALANCE_BUNQ_ENVIRONMENT" to "sandbox",
                                "TEAMBALANCE_BUNQ_CLIENT_ID" to CLIENT_ID,
                                "TEAMBALANCE_BUNQ_CLIENT_SECRET" to CLIENT_SECRET,
                            ),
                        ),
                    )
                }
                .run { ctx ->
                    ctx.startupFailure.shouldBeNull()
                    val properties = ctx.getBean(BunqClientProperties::class.java)
                    properties.environment shouldBe BunqEnvironment.SANDBOX
                    properties.clientId shouldBe CLIENT_ID
                    properties.clientSecret shouldBe CLIENT_SECRET
                    properties.serviceName shouldBe "TeamBalance"
                }
        }

        listOf("prod", "dev").forEach { profile ->
            test("a value that is not none, sandbox or production stops the $profile context") {
                runner(profile).withPropertyValues(*credentials("sanbox")).run { ctx ->
                    messagesOf(ctx.startupFailure) shouldContain "teambalance.bunq.environment"
                }
            }

            test("an empty value stops the $profile context, naming the env var, and wires nothing") {
                runner(profile).withPropertyValues("teambalance.bunq.environment=").run { ctx ->
                    messagesOf(ctx.startupFailure) shouldContain "TEAMBALANCE_BUNQ_ENVIRONMENT"
                }
            }
        }
    }

    context("the client id and secret") {
        listOf("sandbox", "production").forEach { environment ->
            listOf("client-id", "client-secret").forEach { blank ->
                test("a blank $blank with the $environment environment stops the context, naming the env vars but no value") {
                    runner("prod")
                        .withPropertyValues(*credentials(environment), "teambalance.bunq.$blank=")
                        .run { ctx ->
                            val message = messagesOf(ctx.startupFailure)
                            message shouldContain "TEAMBALANCE_BUNQ_CLIENT_ID"
                            message shouldContain "TEAMBALANCE_BUNQ_CLIENT_SECRET"
                            message shouldNotContain CLIENT_SECRET
                        }
                }
            }
        }

        test("are not needed without a Bunq environment") {
            runner("prod").run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBean(BunqClientProperties::class.java).clientId shouldBe ""
            }
        }
    }
}) {
    @TestConfiguration
    @EnableConfigurationProperties(BunqClientProperties::class)
    class SelectionTestBeans {
        @Bean
        fun clock(): Clock = Clock.systemUTC()
    }
}
