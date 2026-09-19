package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.CalendarToken
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldMatch
import io.kotest.matchers.string.shouldNotContain
import java.util.Base64

private fun tokens(salt: String = "calendar-salt", keySeed: Byte = 1) = CalendarLinkTokens(
    salt = salt,
    cipher = TokenCipher.fromBase64Key(
        Base64.getEncoder().encodeToString(ByteArray(32) { keySeed }),
        "teambalance.calendar-link.token-encryption-key",
    ),
)

/**
 * The mint/match/reveal trio a calendar link rests on (ADR-0032). The property that matters is that
 * the two stored forms stay in their lanes: the hash resolves a presented token and cannot be
 * reversed, the ciphertext can be, and neither is derivable from the other without the right secret.
 */
class CalendarLinkTokensTest : FunSpec({

    test("a minted token survives conceal and reveal") {
        val tokens = tokens()
        val token = tokens.mint()
        tokens.reveal(tokens.conceal(token)).value shouldBe token.value
    }

    test("the stored ciphertext does not contain the token") {
        val tokens = tokens()
        val token = tokens.mint()
        tokens.conceal(token).value shouldNotContain token.value
    }

    // 256 bits, base64url, unpadded: 43 characters from the URL-safe alphabet, so it rides a path
    // segment with nothing to escape.
    test("a minted token is 256 bits of base64url") {
        tokens().mint().value shouldMatch Regex("[A-Za-z0-9_-]{43}")
    }

    test("every mint is a different token") {
        val tokens = tokens()
        List(100) { tokens.mint().value }.toSet() shouldHaveSize 100
    }

    test("hashing is deterministic, so a presented token resolves the row it was stored as") {
        val tokens = tokens()
        val token = tokens.mint()
        tokens.hash(token.value) shouldBe tokens.hash(token.value)
    }

    test("the hash does not contain the token") {
        val tokens = tokens()
        val token = tokens.mint()
        tokens.hash(token.value).value shouldNotContain token.value
    }

    // The salt is what stops a stolen hash column being matched against a rainbow table, and what
    // keeps calendar-link hashes from colliding with any other token kind's.
    test("the same token under a different salt hashes differently") {
        val token = CalendarToken("a-fixed-token")
        tokens(salt = "one").hash(token.value) shouldNotBe tokens(salt = "two").hash(token.value)
    }

    test("a token concealed under one key cannot be revealed under another") {
        val token = CalendarToken("a-fixed-token")
        val concealed = tokens(keySeed = 1).conceal(token)
        runCatching { tokens(keySeed = 2).reveal(concealed) }.isFailure shouldBe true
    }
})
