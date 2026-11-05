package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language

interface EmailGateway {
    fun sendMagicLink(email: Email, token: String, language: Language)
}
