package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.Base64
import java.util.UUID

private fun key(seed: Byte) = Base64.getEncoder().encodeToString(ByteArray(32) { seed })

private val CIPHER = TokenCipher.fromBase64Key(key(1), "test-key")
private val SEAL = BunqGrantSeal(CIPHER)
private val TEAM = TeamId(UUID.fromString("00000000-0000-0000-0000-00000000000a"))
private val OTHER_TEAM = TeamId(UUID.fromString("00000000-0000-0000-0000-00000000000b"))
private val GRANT = BunqGrant("access-token")

class BunqGrantSealTest : FunSpec({
    test("a sealed grant opens for the team it was sealed for") {
        SEAL.open(SEAL.seal(GRANT, TEAM), TEAM) shouldBe GRANT
    }

    test("a grant sealed for one team does not open for another") {
        SEAL.open(SEAL.seal(GRANT, TEAM), OTHER_TEAM) shouldBe null
    }

    test("a damaged token does not open") {
        SEAL.open(EncryptedToken("not-a-grant"), TEAM) shouldBe null
    }

    test("a token sealed under another key does not open") {
        SEAL.open(BunqGrantSeal(TokenCipher.fromBase64Key(key(7), "other-key")).seal(GRANT, TEAM), TEAM) shouldBe null
    }

    test("a value sealed for another purpose does not open") {
        val asContext = CIPHER.encrypt(GRANT.accessToken, TokenCipher.aadOf(TEAM, Purpose.BUNQ_API_CONTEXT))
        SEAL.open(asContext, TEAM) shouldBe null
    }

    test("a value sealed without AAD does not open") {
        SEAL.open(CIPHER.encrypt(GRANT.accessToken, TokenCipher.NO_AAD), TEAM) shouldBe null
    }
})
