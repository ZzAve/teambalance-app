package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.TokenCipher
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import org.springframework.boot.autoconfigure.AutoConfigurations
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import java.util.Base64

private val KEY = Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() })
private val CIPHER = TokenCipher.fromBase64Key(KEY, "test-key")
private const val API = "https://api.example/"

class BunqConnectConfigTest : FunSpec({

    context("connect settings") {
        test("are absent while connecting is switched off, in prod too") {
            bunqConnectConfig(false, true, CIPHER, API).shouldBeNull()
        }

        test("carry the callback url of this API when connecting is on") {
            bunqConnectConfig(true, false, CIPHER, API)!!.callbackUrl shouldBe
                "https://api.example/api/bunq/oauth/callback"
        }

        test("refuse to start while connecting is on in prod") {
            shouldThrow<IllegalStateException> { bunqConnectConfig(true, true, CIPHER, API) }
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
                ctx.getBean(TokenCipher::class.java).decrypt(CIPHER.encrypt("x")) shouldBe "x"
            }
        }
    }
})

private fun Throwable?.shouldNotBeNullAndMention(text: String) {
    val messages = generateSequence(this) { it.cause }.map { it.message.orEmpty() }.toList()
    (messages.any { it.contains(text) }) shouldBe true
}
