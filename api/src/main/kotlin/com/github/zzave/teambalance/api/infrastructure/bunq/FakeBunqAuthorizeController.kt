package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.application.BunqConnectionService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.HtmlUtils
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

/**
 * Bunq's approval page, for dev, test and e2e: an Admin picks a login and approves or declines, and
 * the browser goes back to the callback with a code or `error=access_denied`, as at the real Bunq.
 * Plain GETs under `/internal` like the e2e support endpoints; the bean exists only in the dev, test and e2e profiles.
 *
 * The `redirect_uri` must be this app's own callback, so the page is no open redirect even in dev.
 */
@RestController
@Profile("dev", "test", "e2e")
class FakeBunqAuthorizeController(
    private val bunq: FakeBunqGatewayAdapter,
    @param:Value("\${teambalance.api-base-url}") apiBaseUrl: String,
) {
    private val callbackUrl = apiBaseUrl.trimEnd('/') + BunqConnectionService.CALLBACK_PATH

    @GetMapping(FakeBunqGatewayAdapter.AUTHORIZE_PATH, produces = [MediaType.TEXT_HTML_VALUE])
    fun authorize(
        @RequestParam state: String,
        @RequestParam("redirect_uri") redirectUri: String,
    ): ResponseEntity<String> {
        if (redirectUri != callbackUrl) return ResponseEntity.badRequest().build()
        val fields = """<input type="hidden" name="state" value="${HtmlUtils.htmlEscape(state)}">
            |<input type="hidden" name="redirect_uri" value="${HtmlUtils.htmlEscape(redirectUri)}">""".trimMargin()
        return ResponseEntity.ok(
            """<!doctype html>
            |<html lang="en"><head><meta charset="utf-8"><title>Fake Bunq</title></head>
            |<body><h1>Fake Bunq</h1>
            |<form method="get" action="$DECIDE_PATH">$fields
            |<label>Login <input name="login" value="demo"></label>
            |<button name="decision" value="approve">Approve</button>
            |<button name="decision" value="decline">Decline</button>
            |</form></body></html>""".trimMargin(),
        )
    }

    @GetMapping(DECIDE_PATH)
    fun decide(
        @RequestParam state: String,
        @RequestParam("redirect_uri") redirectUri: String,
        @RequestParam login: String,
        @RequestParam decision: String,
    ): ResponseEntity<Void> {
        if (redirectUri != callbackUrl) return ResponseEntity.badRequest().build()
        val back = UriComponentsBuilder.fromUriString(redirectUri).queryParam("state", state)
        if (decision == "approve") back.queryParam("code", bunq.issueCode(login)) else back.queryParam("error", "access_denied")
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(back.build().encode().toUriString())).build()
    }

    private companion object {
        const val DECIDE_PATH = "/internal/fake-bunq/decide"
    }
}
