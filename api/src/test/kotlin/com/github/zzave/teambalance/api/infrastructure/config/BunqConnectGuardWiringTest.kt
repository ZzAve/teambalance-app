package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.mockito.Mockito
import org.springframework.boot.LazyInitializationBeanFactoryPostProcessor
import org.springframework.boot.autoconfigure.AutoConfigurations
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import java.time.Clock
import java.util.Base64
import java.util.function.Supplier

private val KEY = Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() })

/**
 * The prod guard as the Spring context applies it: `bunqConnectionService` reads the active profile and the
 * connect flag from the real application.yml. Only that bean is created (lazy initialisation), with mocks behind it.
 * [BunqConnectConfigTest] covers the guard's decision; this proves it is fed the right profile and flag.
 */
class BunqConnectGuardWiringTest : FunSpec({

    fun runner(profile: String) = ApplicationContextRunner()
        .withInitializer(ConfigDataApplicationContextInitializer())
        .withInitializer { it.addBeanFactoryPostProcessor(LazyInitializationBeanFactoryPostProcessor()) }
        .withConfiguration(AutoConfigurations.of(PropertyPlaceholderAutoConfiguration::class.java))
        .withUserConfiguration(MoneyPoolCompositionRoot::class.java, BunqGrantCipherConfiguration::class.java)
        .withBean(Clock::class.java, Supplier { Clock.systemUTC() })
        .withMock(BunqConnectionRepository::class.java)
        .withMock(BunqOAuthStateRepository::class.java)
        .withMock(BunqGateway::class.java)
        .withMock(TenantScopeGateway::class.java)
        .withMock(TeamRepository::class.java)
        .withMock(TeamMemberRepository::class.java)
        .withMock(ActAsService::class.java)
        .withMock(AuthorizationService::class.java)
        .withMock(MoneyPoolCacheGateway::class.java)
        .withPropertyValues(
            "spring.profiles.active=$profile",
            "teambalance.bunq.token-encryption-key=$KEY",
        )

    fun environment(name: String) = arrayOf(
        "teambalance.bunq.environment=$name",
        "teambalance.bunq.client-id=guard-test-client-id",
        "teambalance.bunq.client-secret=guard-test-client-secret",
    )

    listOf("none", "sandbox").forEach { bunqEnvironment ->
        test("prod with connecting on refuses to start, with the Bunq environment $bunqEnvironment") {
            runner("prod")
                .withPropertyValues("teambalance.bunq.connect-enabled=true", *environment(bunqEnvironment))
                .run { ctx ->
                    val failure = runCatching { ctx.getBean(BunqConnectionService::class.java) }.exceptionOrNull().shouldNotBeNull()

                    val messages = generateSequence(failure) { it.cause }.mapNotNull { it.message }
                    messages.any { it.contains("TEAMBALANCE_BUNQ_CONNECT_ENABLED can only be true in prod") } shouldBe true
                }
        }
    }

    test("prod with connecting on starts, with the Bunq environment production") {
        runner("prod")
            .withPropertyValues("teambalance.bunq.connect-enabled=true", *environment("production"))
            .run { ctx -> ctx.getBean(BunqConnectionService::class.java).shouldNotBeNull() }
    }

    test("prod with connecting off starts, with and without a Bunq environment") {
        runner("prod").withPropertyValues("teambalance.bunq.connect-enabled=false").run { ctx ->
            ctx.getBean(BunqConnectionService::class.java).shouldNotBeNull()
        }
        runner("prod").withPropertyValues("teambalance.bunq.connect-enabled=false", *environment("production")).run { ctx ->
            ctx.getBean(BunqConnectionService::class.java).shouldNotBeNull()
        }
    }

    test("outside prod connecting on starts") {
        runner("dev").withPropertyValues("teambalance.bunq.connect-enabled=true").run { ctx ->
            ctx.getBean(BunqConnectionService::class.java).shouldNotBeNull()
        }
    }
})

private fun <T : Any> ApplicationContextRunner.withMock(type: Class<T>) = withBean(type, Supplier { Mockito.mock(type) })
