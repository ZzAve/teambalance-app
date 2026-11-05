package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain

class MagicLinkEmailTest : FunSpec() {

    init {
        val link = "https://app.teambalance.nl/auth/verify?token=abc123"

        test("url appends the verify route with the token as a query param") {
            MagicLinkEmail.url("https://app.teambalance.nl", "abc123") shouldBe
                "https://app.teambalance.nl/auth/verify?token=abc123"
        }

        test("render produces a Dutch email carrying the link in both text and html parts") {
            val email = MagicLinkEmail.render(link, Language.NL)

            email.subject shouldBe "Je inloglink voor TeamBalance"
            // Plain-text part: link + 15-min expiry + no-reply notice.
            email.text shouldContain link
            email.text shouldContain "15 minuten"
            email.text shouldContain "niet op reageren"
            // HTML part: link is the button's href.
            email.html shouldContain "href=\"$link\""
            email.html shouldContain ">Inloggen</a>"
        }

        test("render produces an English email carrying the link in both text and html parts") {
            val email = MagicLinkEmail.render(link, Language.EN)

            email.subject shouldBe "Your TeamBalance sign-in link"
            email.text shouldContain "Hi,"
            email.text shouldContain link
            email.text shouldContain "15 minutes"
            email.text shouldContain "can't reply"
            email.html shouldContain "href=\"$link\""
            email.html shouldContain ">Sign in</a>"
            email.html shouldNotContain "Hoi"
        }
    }
}
