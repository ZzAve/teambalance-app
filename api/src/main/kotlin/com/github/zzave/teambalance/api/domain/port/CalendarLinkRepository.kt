package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarLinkOptions
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * Calendar links of the current tenant (ADR-0039). No team-scoped finders and no team id: the routed
 * connection's schema already scopes every row, the same way [PositionRepository] is scoped.
 *
 * That scoping is load-bearing rather than incidental — it is what makes a token minted for one team
 * a plain miss under another team's slug, with no cross-team check to remember to write.
 */
interface CalendarLinkRepository {
    /**
     * Every link this member holds in this team, newest first — **including expired ones**, because
     * the cap counts them and the member has to be able to see what is in the way.
     */
    fun findByUser(userId: UserId): List<CalendarLink>

    /** The link a presented token names, or null. Expiry and membership are the caller's checks. */
    fun findByTokenHash(hash: TokenHash): CalendarLink?

    /**
     * Saves [link] only if its owner holds fewer than [max] links in this team, returning whether it
     * was saved.
     *
     * The cap travels with the write because it cannot be held anywhere else. `count(*) < max` is not
     * expressible as an index predicate, so a service that counted and then saved would let two
     * near-simultaneous requests from one member both pass the count — the same read-then-write the
     * invite link accepted in ADR-0025, but here it is cheap to close: one port call is one
     * transaction, so the adapter can serialise the pair per member.
     */
    fun saveWithinCap(link: CalendarLink, max: Int): Boolean

    /**
     * Replaces the label and options of [id] if it belongs to [userId], returning the link as stored,
     * or null when it does not exist or is not theirs. Not a cap question: the link already holds its
     * slot, so an edit never takes or frees one. The token and the dates are never written.
     */
    fun updateOwned(
        id: CalendarLinkId,
        userId: UserId,
        label: CalendarLinkLabel?,
        options: CalendarLinkOptions,
    ): CalendarLink?

    /**
     * Deletes [id] only if it belongs to [userId], returning whether it did. Ownership is in the
     * predicate rather than in a read-then-delete so a delete can never be talked into removing
     * someone else's link, and "not mine" and "no such link" come back indistinguishable.
     */
    fun deleteOwned(id: CalendarLinkId, userId: UserId): Boolean
}
