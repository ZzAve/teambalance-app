package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl

interface MatchFeedGateway {
    /** Reads every match in the feed. Throws MatchFeedUnavailableException when it cannot. */
    fun fetch(url: NevoboFeedUrl): List<FeedMatch>
}
