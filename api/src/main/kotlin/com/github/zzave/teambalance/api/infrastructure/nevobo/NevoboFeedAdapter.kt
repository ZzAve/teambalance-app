package com.github.zzave.teambalance.api.infrastructure.nevobo

import com.github.zzave.teambalance.api.domain.exception.MatchFeedUnavailableException
import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.port.MatchFeedGateway
import org.springframework.http.client.JdkClientHttpRequestFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientException
import java.net.http.HttpClient
import java.time.Duration

private val TIMEOUT: Duration = Duration.ofSeconds(10)

/** Reads a Nevobo programme feed over HTTPS. Redirects are not followed, so the request stays on api.nevobo.nl. */
@Component
class NevoboFeedAdapter(restClientBuilder: RestClient.Builder) : MatchFeedGateway {
    private val restClient = restClientBuilder
        .requestFactory(
            JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(TIMEOUT).followRedirects(HttpClient.Redirect.NEVER).build(),
            ).apply { setReadTimeout(TIMEOUT) },
        )
        .build()

    override fun fetch(url: NevoboFeedUrl): List<FeedMatch> {
        val body = try {
            restClient.get().uri(url.value).retrieve().body(String::class.java)
        } catch (e: RestClientException) {
            throw MatchFeedUnavailableException("The Nevobo feed could not be read: ${e.message}", e)
        }
        return NevoboFeedParser.parse(body.orEmpty())
    }
}
