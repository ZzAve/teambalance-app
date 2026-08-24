package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.InviteToken
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.assertions.throwables.shouldThrowAny
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldNotContain
import java.util.Base64

private fun key(seed: Byte) = Base64.getEncoder().encodeToString(ByteArray(32) { seed })

class InviteTokenCipherTest : FunSpec({

    val cipher = InviteTokenCipher.fromBase64Key(key(1))
    val token = InviteToken("k4Ln9-Qb7xVzA2mE")

    test("a token survives the round trip") {
        cipher.decrypt(cipher.encrypt(token)).value shouldBe token.value
    }

    // A fresh IV per call: two encryptions of one token must not be byte-identical, or the stored
    // column would leak which teams share a link.
    test("encrypting the same token twice yields different ciphertexts") {
        cipher.encrypt(token).value shouldNotBe cipher.encrypt(token).value
    }

    test("the ciphertext does not contain the plaintext") {
        cipher.encrypt(token).value shouldNotContain token.value
    }

    test("a token encrypted under one key cannot be read under another") {
        val encrypted = cipher.encrypt(token)
        shouldThrowAny { InviteTokenCipher.fromBase64Key(key(2)).decrypt(encrypted) }
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
            InviteTokenCipher.fromBase64Key(Base64.getEncoder().encodeToString(ByteArray(16)))
        }
    }

    test("a key that is not base64 is rejected when the cipher is built") {
        shouldThrowAny { InviteTokenCipher.fromBase64Key("not base64!!") }
    }
})
