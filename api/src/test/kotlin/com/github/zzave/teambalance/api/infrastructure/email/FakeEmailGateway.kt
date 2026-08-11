package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.port.EmailGateway

class FakeEmailGateway : EmailGateway {
    val sentMagicLinks = mutableListOf<Pair<Email, String>>()

    override fun sendMagicLink(email: Email, token: String) {
        sentMagicLinks.add(email to token)
    }
}
