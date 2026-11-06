package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.TokenCipher
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.springframework.boot.autoconfigure.AutoConfigurations
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import java.util.Base64

private val KEY = Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() })
private val CIPHER = TokenCipher.fromBase64Key(KEY, "test-key")
private const val API = "https://api.example/"
private const val CALLBACK_URL = "https://api.example/api/bunq/oauth/callback"
private val BUNQ_ENVIRONMENTS = listOf("none", "sandbox", "production")

private fun connectConfig(
    connectEnabled: Boolean,
    isProd: Boolean,
    bunqEnvironment: String,
    allowSandboxInProd: Boolean = false,
) = bunqConnectConfig(connectEnabled, isProd, bunqEnvironment, allowSandboxInProd, CIPHER, API)

class BunqConnectConfigTest : FunSpec({

    context("connect settings") {
        test("are absent while connecting is switched off, in prod too, whatever the Bunq environment and flag") {
            BUNQ_ENVIRONMENTS.forEach { bunqEnvironment ->
                listOf(false, true).forEach { allowSandboxInProd ->
                    connectConfig(false, true, bunqEnvironment, allowSandboxInProd).shouldBeNull()
                }
            }
        }

        test("carry the callback url of this API when connecting is on") {
            connectConfig(true, false, "none")!!.callbackUrl shouldBe CALLBACK_URL
        }

        test("are unchanged outside prod, whatever the Bunq environment and flag") {
            BUNQ_ENVIRONMENTS.forEach { bunqEnvironment ->
                listOf(false, true).forEach { allowSandboxInProd ->
                    connectConfig(true, false, bunqEnvironment, allowSandboxInProd)!!.callbackUrl shouldBe CALLBACK_URL
                }
            }
        }

        test("carry the callback url of this API in prod with the production Bunq environment, with the flag either way") {
            listOf(false, true).forEach { allowSandboxInProd ->
                connectConfig(true, true, "production", allowSandboxInProd)!!.callbackUrl shouldBe CALLBACK_URL
            }
        }

        listOf(" Production ", "PRODUCTION").forEach { bunqEnvironment ->
            test("accept the production Bunq environment in prod spelled \"$bunqEnvironment\"") {
                connectConfig(true, true, bunqEnvironment)!!.callbackUrl shouldBe CALLBACK_URL
            }
        }

        listOf("none", "sandbox", "prod", "", "production-x", " Sandbox ").forEach { bunqEnvironment ->
            test("refuse to start while connecting is on in prod with Bunq environment \"$bunqEnvironment\" and the sandbox flag off") {
                val message = shouldThrow<IllegalStateException> { connectConfig(true, true, bunqEnvironment) }.message!!

                message shouldContain "TEAMBALANCE_BUNQ_CONNECT_ENABLED"
                message shouldContain "TEAMBALANCE_BUNQ_ENVIRONMENT"
                message shouldContain "TEAMBALANCE_BUNQ_ALLOW_SANDBOX_IN_PROD"
                message shouldContain "production"
            }
        }

        listOf("sandbox", " Sandbox ", "SANDBOX").forEach { bunqEnvironment ->
            test("accept the sandbox Bunq environment in prod spelled \"$bunqEnvironment\" when the sandbox flag is on") {
                connectConfig(true, true, bunqEnvironment, allowSandboxInProd = true)!!.callbackUrl shouldBe CALLBACK_URL
            }
        }

        listOf("none", "prod", "", "production-x").forEach { bunqEnvironment ->
            test("refuse to start in prod with connecting on and Bunq environment \"$bunqEnvironment\", also with the sandbox flag on") {
                val message = shouldThrow<IllegalStateException> {
                    connectConfig(true, true, bunqEnvironment, allowSandboxInProd = true)
                }.message!!

                message shouldContain "TEAMBALANCE_BUNQ_ENVIRONMENT"
                message shouldContain "TEAMBALANCE_BUNQ_ALLOW_SANDBOX_IN_PROD"
            }
        }
    }

    // application.yml is loaded for real, and placeholders are resolved strictly as in the app (Boot's
    // PropertyPlaceholderAutoConfiguration): the key has no default there, so this is the start-up of every profile.
    context("the grant key") {
        fun runner() = ApplicationContextRunner()
            .withInitializer(ConfigDataApplicationContextInitializer())
            .withConfiguration(AutoConfigurations.of(PropertyPlaceholderAutoConfiguration::class.java))
            .withUserConfiguration(BunqGrantCipherConfiguration::class.java)

        test("is required at startup: without it the context does not start") {
            runner().run { ctx ->
                // The unresolved placeholder names the env var an operator has to set.
                ctx.startupFailure.shouldNotBeNullAndMention("TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY")
            }
        }

        test("a key that is not 32 bytes of base64 stops the context too") {
            runner().withPropertyValues("teambalance.bunq.token-encryption-key=c2hvcnQ=").run { ctx ->
                ctx.startupFailure.shouldNotBeNullAndMention("must decode to 32 bytes")
            }
        }

        test("a valid key starts the context with the cipher") {
            runner().withPropertyValues("teambalance.bunq.token-encryption-key=$KEY").run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBean(TokenCipher::class.java).decrypt(CIPHER.encrypt("x", TokenCipher.NO_AAD), TokenCipher.NO_AAD) shouldBe "x"
            }
        }
    }
})

private fun Throwable?.shouldNotBeNullAndMention(text: String) {
    val messages = generateSequence(this) { it.cause }.map { it.message.orEmpty() }.toList()
    (messages.any { it.contains(text) }) shouldBe true
}
