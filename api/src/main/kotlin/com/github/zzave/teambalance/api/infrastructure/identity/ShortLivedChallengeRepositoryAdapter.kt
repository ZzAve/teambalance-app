package com.github.zzave.teambalance.api.infrastructure.identity

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRequestOptions
import org.springframework.security.web.webauthn.authentication.HttpSessionPublicKeyCredentialRequestOptionsRepository
import java.time.Duration

/**
 * Keeps a passkey sign-in challenge for five minutes when it opened an anonymous session (ADR-0045).
 * Without this, every anonymous options request would leave a session row for the full session timeout.
 */
class ShortLivedChallengeRepositoryAdapter : HttpSessionPublicKeyCredentialRequestOptionsRepository() {

    override fun save(request: HttpServletRequest, response: HttpServletResponse, options: PublicKeyCredentialRequestOptions?) {
        super.save(request, response, options)
        val session = options?.let { request.getSession(false) } ?: return
        if (session.getAttribute(SessionKeys.USER_ID) == null) session.maxInactiveInterval = CHALLENGE_TTL.seconds.toInt()
    }

    private companion object {
        val CHALLENGE_TTL: Duration = Duration.ofMinutes(5)
    }
}
