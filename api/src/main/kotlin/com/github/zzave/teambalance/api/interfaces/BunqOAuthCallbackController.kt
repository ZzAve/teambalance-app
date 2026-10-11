package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.BunqConnectResult
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URI

/**
 * Where Bunq sends the browser back to after the Admin approved or declined (ADR-0042). A browser
 * redirect, not an API call, so it is outside the Wirespec contract. Public: the single-use `state`
 * is the credential, and a session is optional because the return trip can land in a browser the
 * Admin never signed in to (an installed PWA hands OAuth to the system browser).
 *
 * Always answers with a redirect to the app, whatever happened, so the Admin never meets an API error page.
 */
@RestController
class BunqOAuthCallbackController(
    private val bunqConnectionService: BunqConnectionService,
    private val currentUserGateway: CurrentUserGateway,
    @param:Value("\${teambalance.frontend-base-url}") frontendBaseUrl: String,
) {
    private val frontend = frontendBaseUrl.trimEnd('/')

    @GetMapping(BunqConnectionService.CALLBACK_PATH)
    fun callback(
        @RequestParam(required = false) state: String?,
        @RequestParam(required = false) code: String?,
        @RequestParam(required = false) error: String?,
    ): ResponseEntity<Void> {
        val outcome = bunqConnectionService.complete(state, code, error, currentUserGateway.getCurrentUserId())
        val target = outcome.teamSlug
            ?.let { "$frontend/t/${it.value}/team/settings?bunq=${outcome.result.query()}" }
            ?: "$frontend/"
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(target)).build()
    }

    private fun BunqConnectResult.query() = when (this) {
        BunqConnectResult.CONNECTED -> "connected"
        BunqConnectResult.DECLINED -> "declined"
        BunqConnectResult.FAILED -> "error"
    }
}
