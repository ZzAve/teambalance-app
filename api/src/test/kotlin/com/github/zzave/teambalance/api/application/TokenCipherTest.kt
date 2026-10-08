package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.assertions.throwables.shouldThrowAny
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldNotContain
import java.util.Base64

private fun key(seed: Byte) = Base64.getEncoder().encodeToString(ByteArray(32) { seed })

// Named in every rejection message so an operator is told which of the sibling keys is misconfigured.
private const val PROPERTY = "teambalance.invitation.token-encryption-key"

class TokenCipherTest : FunSpec({

    val cipher = TokenCipher.fromBase64Key(key(1), PROPERTY)
    val token = "k4Ln9-Qb7xVzA2mE"

    test("a token survives the round trip") {
        cipher.decrypt(cipher.encrypt(token)) shouldBe token
    }

    // A fresh IV per call: two encryptions of one token must not be byte-identical, or the stored
    // column would leak which teams share a link.
    test("encrypting the same token twice yields different ciphertexts") {
        cipher.encrypt(token).value shouldNotBe cipher.encrypt(token).value
    }

    test("the ciphertext does not contain the plaintext") {
        cipher.encrypt(token).value shouldNotContain token
    }

    test("a token encrypted under one key cannot be read under another") {
        val encrypted = cipher.encrypt(token)
        shouldThrowAny { TokenCipher.fromBase64Key(key(2), PROPERTY).decrypt(encrypted) }
    }

    // GCM authenticates, so a tampered row fails loudly instead of yielding a token that would then
    // be handed to an admin as if it were the real link.
    test("a tampered ciphertext fails to decrypt") {
        val raw = Base64.getDecoder().decode(cipher.encrypt(token).value)
        raw[raw.lastIndex] = (raw[raw.lastIndex] + 1).toByte()

        shouldThrowAny { cipher.decrypt(EncryptedToken(Base64.getEncoder().encodeToString(raw))) }
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
