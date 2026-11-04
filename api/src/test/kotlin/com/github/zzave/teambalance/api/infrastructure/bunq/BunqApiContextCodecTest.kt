package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqServer
import com.bunq.sdk.BunqSigningKeysGenerator
import com.bunq.sdk.Config
import com.bunq.sdk.Context
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldNotContain
import java.time.Instant

private val SERVER = BunqServer("http://localhost:1/v1/", "")
private const val API_KEY = "api-key-never-in-a-message"

private fun context() = Context(
    serverPublicKey = "-----BEGIN PUBLIC KEY-----\nserver\n-----END PUBLIC KEY-----\n",
    deviceId = 11,
    sessionId = 12,
    sessionToken = "session-token-value",
    userId = 13,
    sessionExpiryTime = Instant.parse("2026-11-10T12:00:00.123456Z"),
    installationToken = "installation-token-value",
    config = Config(SERVER, "TeamBalance", API_KEY, BunqSigningKeysGenerator.generateBunqSigningKeys()),
)

class BunqApiContextCodecTest : FunSpec({

    test("a context survives encoding and decoding with every field, including the signing keys") {
        val original = context()

        val restored = BunqApiContextCodec.decode(BunqApiContextCodec.encode(original), SERVER, "TeamBalance")

        restored.serverPublicKey shouldBe original.serverPublicKey
        restored.deviceId shouldBe original.deviceId
        restored.sessionId shouldBe original.sessionId
        restored.sessionToken shouldBe original.sessionToken
        restored.userId shouldBe original.userId
        restored.sessionExpiryTime shouldBe original.sessionExpiryTime
        restored.installationToken shouldBe original.installationToken
        restored.config.apiKey shouldBe API_KEY
        restored.config.signingKeys.privateKeyAsPem() shouldBe original.config.signingKeys.privateKeyAsPem()
        restored.config.signingKeys.publicKeyAsPem() shouldBe original.config.signingKeys.publicKeyAsPem()
    }

    test("the restored context talks to the server and under the service name it is given") {
        val other = BunqServer("http://localhost:2/v1/", "")

        val restored = BunqApiContextCodec.decode(BunqApiContextCodec.encode(context()), other, "Other name")

        restored.config.bunqServer shouldBe other
        restored.config.serviceName shouldBe "Other name"
    }

    test("something that is not an encoded context is refused without echoing it") {
        val failure = shouldThrow<Exception> { BunqApiContextCodec.decode("""{"sessionToken":"leaky-value"}""", SERVER, "TeamBalance") }

        generateSequence<Throwable>(failure) { it.cause }.forEach { it.message.orEmpty() shouldNotContain "leaky-value" }
    }
})
