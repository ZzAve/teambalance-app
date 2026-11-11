package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.exception.MatchFeedUnavailableException
import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.port.MatchFeedGateway
import java.util.concurrent.ConcurrentHashMap

/** Serves the matches a test puts in for a feed URL; a URL with none is unreachable. Shared by every IT context. */
class FakeMatchFeedGateway : MatchFeedGateway {
    private val feeds = ConcurrentHashMap<String, List<FeedMatch>>()

    fun serve(url: String, matches: List<FeedMatch>) {
        feeds[url] = matches
    }

    fun takeDown(url: String) {
        feeds.remove(url)
    }

    override fun fetch(url: NevoboFeedUrl): List<FeedMatch> =
        feeds[url.value] ?: throw MatchFeedUnavailableException("No fake feed at ${url.value}")
}
