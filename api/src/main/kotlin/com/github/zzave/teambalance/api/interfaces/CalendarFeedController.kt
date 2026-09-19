package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CalendarFeedService
import com.github.zzave.teambalance.api.domain.model.Slug
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import java.security.MessageDigest
import java.util.concurrent.TimeUnit

/**
 * The webcal feed behind a **Calendar link** (ADR-0032).
 *
 * **Not Wirespec, on purpose.** Wirespec models JSON request/response types; this endpoint serves
 * `text/calendar` to a calendar client, and the SPA never calls it — there is no generated client for
 * it to be the contract of. So it is a plain Spring controller, and the contract that matters is
 * RFC 5545, enforced in [CalendarIcs] and its tests.
 *
 * **Deliberately session-less.** The API has no Spring Security: authentication is enforced per
 * controller by calling `CurrentUserGateway.requireCurrentUserId()`, so a controller is public exactly
 * by not calling it — which this one does not, the same way the `/api/auth` endpoints do not. There is no CSRF
 * filter and no session filter that would reject a cookie-less `GET`; Spring Session's filter only
 * wraps the request, and [com.github.zzave.teambalance.api.infrastructure.identity.SessionUserContextFilter]
 * leaves an anonymous request anonymous. The token in the path is the whole credential.
 */
@RestController
class CalendarFeedController(
    private val calendarFeedService: CalendarFeedService,
    // The SPA origin, so a calendar entry can link back to the event page it came from.
    @param:Value("\${teambalance.frontend-base-url}") private val frontendBaseUrl: String,
) {
    /**
     * Every failure — unknown slug, unknown token, expired link, a token minted for another team, an
     * owner who has since left — is the same bare 404, with nothing in the body to tell them apart.
     * The endpoint is unauthenticated and its identifiers are guessable-looking, so telling a caller
     * *which* of those they hit would turn it into an oracle for the others.
     */
    @GetMapping("/api/calendar/{teamSlug}/{token}.ics")
    fun feed(
        @PathVariable teamSlug: String,
        @PathVariable token: String,
        @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) ifNoneMatch: String?,
    ): ResponseEntity<String> {
        val feed = calendarFeedService.feed(Slug(teamSlug), token) ?: return ResponseEntity.notFound().build()
        val body = CalendarIcs.render(feed, frontendBaseUrl.trimEnd('/'))
        val eTag = "\"${sha256Hex(body)}\""

        // A calendar client refetches hourly whether or not anything changed, so the 304 is the point:
        // an unchanged schedule costs the client nothing but a round trip.
        val unchanged = ifNoneMatch?.split(',')?.any { it.trim() == eTag } == true
        return if (unchanged) notModified(eTag) else calendar(eTag, body)
    }

    private fun notModified(eTag: String): ResponseEntity<String> =
        revalidating(HttpStatus.NOT_MODIFIED, eTag).build()

    private fun calendar(eTag: String, body: String): ResponseEntity<String> =
        revalidating(HttpStatus.OK, eTag)
            .contentType(MediaType.parseMediaType("text/calendar;charset=UTF-8"))
            .body(body)

    /**
     * Private and immediately stale: the URL is a bearer credential and the body is one member's own
     * schedule, so no shared cache may hold it, and every fetch revalidates against the ETag rather
     * than serving an answer the member has since changed.
     */
    private fun revalidating(status: HttpStatus, eTag: String) =
        ResponseEntity.status(status)
            .eTag(eTag)
            .cacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePrivate())

    private fun sha256Hex(body: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(body.toByteArray())
            .joinToString("") { "%02x".format(it) }
}
