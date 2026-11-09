package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language
import com.github.zzave.teambalance.api.domain.port.EmailGateway

class FakeEmailGateway : EmailGateway {
    val sentMagicLinks = mutableListOf<Pair<Email, String>>()

    /** The email as the real adapters would render it, so an IT can read what the recipient got. */
    val renderedMagicLinks = mutableListOf<Pair<Email, RenderedEmail>>()

    override fun sendMagicLink(email: Email, token: String, language: Language) {
        sentMagicLinks.add(email to token)
        renderedMagicLinks.add(email to MagicLinkEmail.render(MagicLinkEmail.url("http://localhost", token), language))
    }
}
