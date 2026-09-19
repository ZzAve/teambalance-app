package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CalendarLinkLimitReachedException
import com.github.zzave.teambalance.api.domain.exception.CalendarLinkNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NotUnderActAsException
import com.github.zzave.teambalance.api.domain.model.CalendarFeedUrl
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import java.time.Clock
import java.time.Instant

/**
 * A calendar link as its owner sees it: everything but the secret, plus the one URL the secret is for.
 *
 * [expired] is served rather than left to the client to derive from [expiresAt], because it is the
 * server's clock that decides whether a feed still answers, and a client that computed it from a
 * skewed one would tell the member their working link is dead (or the reverse).
 */
data class IssuedCalendarLink(
    val id: CalendarLinkId,
    val label: CalendarLinkLabel?,
    val createdAt: Instant,
    val expiresAt: Instant,
    val expired: Boolean,
    val url: CalendarFeedUrl,
)

/**
 * The member-facing half of **Calendar links** (ADR-0032): create, list and delete your own
 * subscription URLs for your Active Team. The feed those URLs address is [CalendarFeedService]'s.
 *
 * Every operation is scoped to the *caller's own* links. There is no admin view and no admin control:
 * a calendar link is a personal credential, and an admin who could list or revoke one would be reading
 * (or breaking) a teammate's private subscription for no stated purpose.
 *
 * Blocked entirely under **Act-as** ([NotUnderActAsException]) — see ADR-0032 §"Act-as".
 */
class CalendarLinkService(
    private val calendarLinkRepository: CalendarLinkRepository,
    private val teamRepository: TeamRepository,
    private val authorizationService: AuthorizationService,
    private val actAsGateway: ActAsGateway,
    private val tokens: CalendarLinkTokens,
    private val clock: Clock,
    // Public origin of this API — the host a calendar client will fetch the feed from. A sibling of
    // teambalance.frontend-base-url (which addresses the SPA), read by the composition root.
    private val apiBaseUrl: String,
) {
    /** The caller's links in [teamId], newest first, expired ones included — the cap counts those. */
    fun listLinks(callerId: UserId, teamId: TeamId): List<IssuedCalendarLink> {
        requireOwnAccess(callerId, teamId)
        val slug = slugOf(teamId)
        val now = clock.instant()
        return calendarLinkRepository.findByUser(callerId).map { it.issued(slug, now) }
    }

    /**
     * Mints a link for the caller. Explicit, never implicit: nothing creates one on a member's behalf,
     * so a member's exposure is exactly the links they asked for.
     *
     * Refused with a 409 once [CalendarLink.MAX_PER_MEMBER] exist, expired ones counted — the caller
     * resolves it by deleting one, which is a thing they can see and do.
     */
    fun createLink(callerId: UserId, teamId: TeamId, rawLabel: String?): IssuedCalendarLink {
        requireOwnAccess(callerId, teamId)
        val existing = calendarLinkRepository.findByUser(callerId)
        if (existing.size >= CalendarLink.MAX_PER_MEMBER) {
            throw CalendarLinkLimitReachedException(CalendarLink.MAX_PER_MEMBER)
        }

        val now = clock.instant()
        val token = tokens.mint()
        val saved = calendarLinkRepository.save(
            CalendarLink(
                id = CalendarLinkId.random(),
                userId = callerId,
                tokenHash = tokens.hash(token.value),
                encryptedToken = tokens.conceal(token),
                label = CalendarLinkLabel.ofNullable(rawLabel),
                createdAt = now,
                expiresAt = now.plus(CalendarLink.TTL),
            ),
        )
        // Built from the token just minted rather than by decrypting what was stored: a create that
        // returned a URL is a create whose round trip through the cipher has not been exercised, and
        // the read path is where that gets proven anyway.
        return saved.issued(slugOf(teamId), now, token)
    }

    /**
     * Deletes one of the caller's own links. The only revocation there is — links do not renew, and
     * nobody else can delete yours.
     *
     * A link that is not the caller's is reported as not found, indistinguishably from one that never
     * existed, so link ids cannot be probed.
     */
    fun deleteLink(callerId: UserId, teamId: TeamId, id: CalendarLinkId) {
        requireOwnAccess(callerId, teamId)
        if (!calendarLinkRepository.deleteOwned(id, callerId)) throw CalendarLinkNotFoundException(id)
    }

    /**
     * Act-as is refused before membership is even asked, and deliberately in that order: a Platform
     * Admin inside a team holds a **Virtual Member** that would satisfy [AuthorizationService] and let
     * them mint a standing credential in somebody else's team (ADR-0024 §2).
     */
    private fun requireOwnAccess(callerId: UserId, teamId: TeamId) {
        if (actAsGateway.current() != null) throw NotUnderActAsException()
        authorizationService.requireMember(callerId, teamId)
    }

    // The caller is an established member of this team, so the team exists; a missing row here is a
    // broken invariant, not a user error.
    private fun slugOf(teamId: TeamId): Slug =
        teamRepository.findById(teamId)?.slug ?: error("Team $teamId has no platform record")

    private fun CalendarLink.issued(slug: Slug, now: Instant, token: CalendarToken = tokens.reveal(encryptedToken)) =
        IssuedCalendarLink(
            id = id,
            label = label,
            createdAt = createdAt,
            expiresAt = expiresAt,
            expired = !isLiveAt(now),
            url = CalendarFeedUrl("$apiBaseUrl/api/calendar/$slug/${token.value}.ics"),
        )
}
