package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.E2eMagicLinkTokenRecorder
import org.springframework.context.annotation.Profile
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * E2e-profile-only support endpoint under `/internal` (like the actuator): lets Playwright
 * fetch the plaintext magic-link token that a login flow just requested, instead of grepping
 * backend logs. Deliberately not part of the Wirespec contract — it is test scaffolding, not
 * API surface, and never ships in prod.
 */
@RestController
@Profile("e2e")
class E2eSupportController(private val recorder: E2eMagicLinkTokenRecorder) {

    data class MagicLinkTokenResponse(val token: String)

    @GetMapping("/internal/e2e/magic-link-token")
    fun magicLinkToken(@RequestParam email: String): ResponseEntity<MagicLinkTokenResponse> =
        recorder.lastTokenFor(email)
            ?.let { ResponseEntity.ok(MagicLinkTokenResponse(it)) }
            ?: ResponseEntity.notFound().build()
}
