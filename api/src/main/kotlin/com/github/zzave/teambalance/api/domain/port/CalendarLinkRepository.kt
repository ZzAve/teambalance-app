package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * Calendar links of the current tenant (ADR-0032). No team-scoped finders and no team id: the routed
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

    fun save(link: CalendarLink): CalendarLink

    /**
     * Deletes [id] only if it belongs to [userId], returning whether it did. Ownership is in the
     * predicate rather than in a read-then-delete so a delete can never be talked into removing
     * someone else's link, and "not mine" and "no such link" come back indistinguishable.
     */
    fun deleteOwned(id: CalendarLinkId, userId: UserId): Boolean
}
