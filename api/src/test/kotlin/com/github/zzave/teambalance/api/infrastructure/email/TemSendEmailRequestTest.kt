package com.github.zzave.teambalance.api.infrastructure.email

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class TemSendEmailRequestTest : FunSpec() {

    init {
        test("externalize maps a rendered email onto the TEM send-email payload") {
            val rendered = RenderedEmail(subject = "Onderwerp", text = "platte tekst", html = "<p>html</p>")

            val request = rendered.externalize(
                from = TemAddress(email = "login@teambalance.nl", name = "TeamBalance"),
                to = TemAddress(email = "speler@example.com"),
                projectId = "project-42",
            )

            request.from shouldBe TemAddress(email = "login@teambalance.nl", name = "TeamBalance")
            request.to shouldBe listOf(TemAddress(email = "speler@example.com"))
            request.subject shouldBe "Onderwerp"
            request.text shouldBe "platte tekst"
            request.html shouldBe "<p>html</p>"
            request.projectId shouldBe "project-42"
        }
    }
}
