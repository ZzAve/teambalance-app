package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.assertions.throwables.shouldThrowAny
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldNotContain
import java.util.Base64
import java.util.UUID
import javax.crypto.AEADBadTagException

private fun key(seed: Byte) = Base64.getEncoder().encodeToString(ByteArray(32) { seed })

// Named in every rejection message so an operator is told which of the sibling keys is misconfigured.
private const val PROPERTY = "teambalance.invitation.token-encryption-key"

class TokenCipherTest : FunSpec({

    val cipher = TokenCipher.fromBase64Key(key(1), PROPERTY)
    val token = "k4Ln9-Qb7xVzA2mE"
    val teamA = TeamId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
    val teamB = TeamId(UUID.fromString("22222222-2222-2222-2222-222222222222"))
    val aadA = TokenCipher.aadOf(teamA, Purpose.BUNQ_GRANT)
    val aadB = TokenCipher.aadOf(teamB, Purpose.BUNQ_GRANT)

    test("a token survives the round trip") {
        cipher.decrypt(cipher.encrypt(token, aadA), aadA) shouldBe token
    }

    // A fresh IV per call: two encryptions of one token must not be byte-identical, or the stored
    // column would leak which teams share a link.
    test("encrypting the same token twice yields different ciphertexts") {
        cipher.encrypt(token, aadA).value shouldNotBe cipher.encrypt(token, aadA).value
    }

    test("the ciphertext does not contain the plaintext") {
        cipher.encrypt(token, aadA).value shouldNotContain token
    }

    test("a token encrypted under one key cannot be read under another") {
        val encrypted = cipher.encrypt(token, aadA)
        shouldThrowAny { TokenCipher.fromBase64Key(key(2), PROPERTY).decrypt(encrypted, aadA) }
    }

    // GCM authenticates, so a tampered row fails loudly instead of yielding a token that would then
    // be handed to an admin as if it were the real link.
    test("a tampered ciphertext fails to decrypt") {
        val raw = Base64.getDecoder().decode(cipher.encrypt(token, aadA).value)
        raw[raw.lastIndex] = (raw[raw.lastIndex] + 1).toByte()

        shouldThrowAny { cipher.decrypt(EncryptedToken(Base64.getEncoder().encodeToString(raw)), aadA) }
    }

    // The point of the AAD: a value copied into another team's row must not open there, even though the
    // key is the same.
    test("a token encrypted for one team cannot be decrypted with another team's AAD") {
        val encrypted = cipher.encrypt(token, aadA)

        shouldThrow<AEADBadTagException> { cipher.decrypt(encrypted, aadB) }
    }

    test("a token encrypted with an AAD cannot be decrypted without one, and the other way round") {
        shouldThrow<AEADBadTagException> { cipher.decrypt(cipher.encrypt(token, aadA), TokenCipher.NO_AAD) }
        shouldThrow<AEADBadTagException> { cipher.decrypt(cipher.encrypt(token, TokenCipher.NO_AAD), aadA) }
    }

    test("the AAD of a team and a purpose is the purpose, a colon and the UTF-8 team id, and differs per team") {
        aadA shouldBe "bunq-grant:11111111-1111-1111-1111-111111111111".toByteArray(Charsets.UTF_8)
        TokenCipher.aadOf(teamA, Purpose.BUNQ_API_CONTEXT) shouldBe
            "bunq-api-context:11111111-1111-1111-1111-111111111111".toByteArray(Charsets.UTF_8)
        aadA.contentEquals(aadB) shouldBe false
    }

    // Same key, same team: a value made for one purpose must not open as the other, so a Context put in the grant
    // column (or a grant in the Context column) is not read as the other.
    test("a value made for one purpose of a team does not open as the other purpose of the same team") {
        val grantAad = TokenCipher.aadOf(teamA, Purpose.BUNQ_GRANT)
        val contextAad = TokenCipher.aadOf(teamA, Purpose.BUNQ_API_CONTEXT)

        shouldThrow<AEADBadTagException> { cipher.decrypt(cipher.encrypt(token, contextAad), grantAad) }
        shouldThrow<AEADBadTagException> { cipher.decrypt(cipher.encrypt(token, grantAad), contextAad) }
        cipher.decrypt(cipher.encrypt(token, contextAad), contextAad) shouldBe token
    }

    // The invite and calendar links already stored were made without any AAD; they must keep opening.
    test("the stored format is unchanged: a value made without any AAD opens with the empty AAD") {
        val stored = legacyEncrypt(ByteArray(32) { 1 }, token)

        cipher.decrypt(stored, TokenCipher.NO_AAD) shouldBe token
        shouldThrow<AEADBadTagException> { cipher.decrypt(stored, aadA) }
    }

    // A mis-sized key is a deployment mistake; it must surface at startup, not on an admin's first
    // click.
    test("a key of the wrong length is rejected when the cipher is built") {
        shouldThrow<IllegalArgumentException> {
            TokenCipher.fromBase64Key(Base64.getEncoder().encodeToString(ByteArray(16)), PROPERTY)
        }
    }

    test("a key that is not base64 is rejected when the cipher is built") {
        shouldThrowAny { TokenCipher.fromBase64Key("not base64!!", PROPERTY) }
    }
})
