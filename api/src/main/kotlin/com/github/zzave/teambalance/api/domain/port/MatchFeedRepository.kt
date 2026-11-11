package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchFeedSettings
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import java.time.Instant

/** The current team's match feed and the matches its last successful check read. */
interface MatchFeedRepository {
    fun find(): MatchFeedSettings?

    /** Sets the feed and team, and stores [matches] as read at [checkedAt]. Replaces any earlier feed. */
    fun save(url: NevoboFeedUrl, teamName: NevoboTeamName, matches: List<FeedMatch>, checkedAt: Instant)

    fun delete()

    /**
     * Sets the last check time to [now] when the feed was last checked before [dueBefore], or never. Returns
     * true when it did, so the caller runs the check; one statement, so two callers cannot both get true.
     */
    fun claimCheck(now: Instant, dueBefore: Instant): Boolean

    /** Replaces the stored matches with [matches] and clears the failed mark. */
    fun recordSuccess(matches: List<FeedMatch>)

    /** Marks the last check as failed and keeps the stored matches. */
    fun recordFailure()

    fun matches(): List<FeedMatch>
}
