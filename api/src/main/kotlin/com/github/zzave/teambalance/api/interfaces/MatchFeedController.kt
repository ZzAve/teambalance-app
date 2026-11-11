package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.MatchFeedService
import com.github.zzave.teambalance.api.application.MatchFeedStatus as DomainMatchFeedStatus
import com.github.zzave.teambalance.api.domain.exception.InvalidMatchFeedUrlException
import com.github.zzave.teambalance.api.domain.model.FeedMatch as DomainFeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchDifference as DomainMatchDifference
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ConfigureMatchFeed
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMatchFeed
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListMatchFeedTeams
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RemoveMatchFeed
import com.github.zzave.teambalance.api.interfaces.generated.model.DateTimestampWithTimezone
import com.github.zzave.teambalance.api.interfaces.generated.model.FeedMatch
import com.github.zzave.teambalance.api.interfaces.generated.model.MatchDifference
import com.github.zzave.teambalance.api.interfaces.generated.model.MatchFeedStatus
import com.github.zzave.teambalance.api.interfaces.generated.model.MatchFeedTeams
import com.github.zzave.teambalance.api.interfaces.generated.model.MatchMismatch
import org.springframework.web.bind.annotation.RestController

@RestController
class MatchFeedController(
    private val matchFeedService: MatchFeedService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListMatchFeedTeams.Handler,
    GetMatchFeed.Handler,
    ConfigureMatchFeed.Handler,
    RemoveMatchFeed.Handler {

    override suspend fun listMatchFeedTeams(request: ListMatchFeedTeams.Request): ListMatchFeedTeams.Response<*> {
        val teams = matchFeedService.teamsInFeed(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            url = request.body.feedUrl.consumeFeedUrl(),
        )
        return ListMatchFeedTeams.Response200(MatchFeedTeams(teams = teams))
    }

    override suspend fun getMatchFeed(request: GetMatchFeed.Request): GetMatchFeed.Response<*> {
        val status = matchFeedService.status(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
        ) ?: return GetMatchFeed.Response404
        return GetMatchFeed.Response200(status.produce())
    }

    override suspend fun configureMatchFeed(request: ConfigureMatchFeed.Request): ConfigureMatchFeed.Response<*> {
        val status = matchFeedService.configure(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            url = request.body.feedUrl.consumeFeedUrl(),
            teamName = NevoboTeamName(request.body.teamName.trim()),
        )
        return ConfigureMatchFeed.Response200(status.produce())
    }

    override suspend fun removeMatchFeed(request: RemoveMatchFeed.Request): RemoveMatchFeed.Response<*> {
        matchFeedService.remove(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
        )
        return RemoveMatchFeed.Response204
    }
}

private fun String.consumeFeedUrl(): NevoboFeedUrl =
    runCatching { NevoboFeedUrl(trim()) }.getOrElse { throw InvalidMatchFeedUrlException() }

private fun DomainMatchFeedStatus.produce() = MatchFeedStatus(
    feedUrl = settings.url.value,
    teamName = settings.teamName.value,
    lastCheckedAt = settings.lastCheckedAt?.let { DateTimestampWithTimezone(it.toString()) },
    lastCheckFailed = settings.lastCheckFailed,
    mismatches = findings.mismatches.map { mismatch ->
        MatchMismatch(
            eventId = mismatch.event.id.produce(),
            eventTitle = mismatch.event.title.value,
            eventStartTime = DateTimestampWithTimezone(mismatch.event.startTime.toString()),
            eventLocation = mismatch.event.location?.value,
            feedMatch = mismatch.match.produce(),
            differences = mismatch.differences.sorted().map { it.produce() },
        )
    },
    missing = findings.missing.map { it.produce() },
)

private fun DomainFeedMatch.produce() = FeedMatch(
    code = code.value,
    link = link.value,
    startTime = DateTimestampWithTimezone(startTime.toString()),
    homeTeam = homeTeam.value,
    awayTeam = awayTeam.value,
    venue = venue?.value,
)

private fun DomainMatchDifference.produce(): MatchDifference = when (this) {
    DomainMatchDifference.START_TIME -> MatchDifference.START_TIME
    DomainMatchDifference.LOCATION -> MatchDifference.LOCATION
    DomainMatchDifference.OPPONENT -> MatchDifference.OPPONENT
}
