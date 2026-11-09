package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.AuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity
import org.springframework.stereotype.Component

/**
 * Turns a verified passkey assertion into the app's own session (ADR-0045): the same call magic-link
 * verify makes, so the session id rotates, act-as closes and the landing Team is pinned.
 */
@Component
class PasskeySignInSuccessHandler(
    private val authService: AuthService,
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication,
    ) {
        val userEntity = authentication.principal as PublicKeyCredentialUserEntity
        authService.startSession(userEntity.id.toUserId())
        response.status = HttpServletResponse.SC_NO_CONTENT
    }
}
