package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain

private const val SECRET = "never-printed-secret"

class BunqClientPropertiesTest : FunSpec({

    test("without a Bunq environment the client id and secret may be blank") {
        BunqClientProperties(BunqEnvironment.NONE, "", "", "TeamBalance")
    }

    listOf(BunqEnvironment.SANDBOX, BunqEnvironment.PRODUCTION).forEach { environment ->
        test("with $environment both the client id and the secret are required, and the message names the env vars") {
            listOf("" to SECRET, "id" to "", " " to SECRET).forEach { (clientId, clientSecret) ->
                val message = shouldThrow<IllegalArgumentException> {
                    BunqClientProperties(environment, clientId, clientSecret, "TeamBalance")
                }.message!!

                message shouldContain "TEAMBALANCE_BUNQ_CLIENT_ID"
                message shouldContain "TEAMBALANCE_BUNQ_CLIENT_SECRET"
                message shouldNotContain SECRET
            }
        }
    }

    test("an empty environment is refused, and the message names the env var") {
        shouldThrow<IllegalArgumentException> { BunqClientProperties(null, "id", SECRET, "TeamBalance") }
            .message!! shouldContain "TEAMBALANCE_BUNQ_ENVIRONMENT"
    }

    test("the secret is masked when the properties are printed") {
        BunqClientProperties(BunqEnvironment.SANDBOX, "id", SECRET, "TeamBalance").toString() shouldNotContain SECRET
    }
})
