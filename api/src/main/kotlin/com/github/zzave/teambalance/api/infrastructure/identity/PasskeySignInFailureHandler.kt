package com.github.zzave.teambalance.api.infrastructure.identity

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.AuthenticationFailureHandler

/**
 * 401 for every failed passkey sign-in. When the server has no such passkey (removed, or its user deleted, which
 * cascades), the body is `{"error":"unknown_passkey"}` so the SPA can tell the browser to drop it (ADR-0045).
 * Any other failure (expired challenge, bad signature) has no body: the passkey may still be good.
 */
class PasskeySignInFailureHandler : AuthenticationFailureHandler {

    override fun onAuthenticationFailure(
        request: HttpServletRequest,
        response: HttpServletResponse,
        exception: AuthenticationException,
    ) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        if (isUnknownPasskey(exception)) {
            response.contentType = MediaType.APPLICATION_JSON_VALUE
            response.writer.write("""{"error":"unknown_passkey"}""")
        }
    }

    // shortcut: matches the message of Spring's Webauthn4JRelyingPartyOperations, which has no typed exception for
    // this; PasskeyEndpointsIT fails if an upgrade changes it.
    private fun isUnknownPasskey(exception: AuthenticationException): Boolean =
        exception.cause?.message?.startsWith("Unable to find CredentialRecord with id") == true
}
