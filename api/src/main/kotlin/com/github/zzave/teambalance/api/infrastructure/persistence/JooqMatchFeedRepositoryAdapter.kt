package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchAddress
import com.github.zzave.teambalance.api.domain.model.MatchCode
import com.github.zzave.teambalance.api.domain.model.MatchFeedSettings
import com.github.zzave.teambalance.api.domain.model.MatchLink
import com.github.zzave.teambalance.api.domain.model.MatchVenue
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import com.github.zzave.teambalance.api.domain.port.MatchFeedRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MATCH_FEED
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MATCH_FEED_MATCHES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset

private const val SINGLETON_ID: Short = 1

@Repository
class JooqMatchFeedRepositoryAdapter(
    private val dsl: DSLContext,
) : MatchFeedRepository {

    override fun find(): MatchFeedSettings? =
        dsl.selectFrom(MATCH_FEED)
            .where(MATCH_FEED.ID.eq(SINGLETON_ID))
            .fetchOne()
            ?.let {
                MatchFeedSettings(
                    url = NevoboFeedUrl(it.feedUrl),
                    teamName = NevoboTeamName(it.teamName),
                    lastCheckedAt = it.lastCheckedAt?.toInstant(),
                    lastCheckFailed = it.lastCheckFailed,
                )
            }

    @Transactional
    override fun save(url: NevoboFeedUrl, teamName: NevoboTeamName, matches: List<FeedMatch>, checkedAt: Instant) {
        val checked = checkedAt.atOffset(ZoneOffset.UTC)
        dsl.insertInto(MATCH_FEED)
            .set(MATCH_FEED.ID, SINGLETON_ID)
            .set(MATCH_FEED.FEED_URL, url.value)
            .set(MATCH_FEED.TEAM_NAME, teamName.value)
            .set(MATCH_FEED.LAST_CHECKED_AT, checked)
            .set(MATCH_FEED.LAST_CHECK_FAILED, false)
            .onConflict(MATCH_FEED.ID)
            .doUpdate()
            .set(MATCH_FEED.FEED_URL, url.value)
            .set(MATCH_FEED.TEAM_NAME, teamName.value)
            .set(MATCH_FEED.LAST_CHECKED_AT, checked)
            .set(MATCH_FEED.LAST_CHECK_FAILED, false)
            .execute()
        replaceMatches(matches)
    }

    @Transactional
    override fun delete() {
        dsl.deleteFrom(MATCH_FEED_MATCHES).execute()
        dsl.deleteFrom(MATCH_FEED).execute()
    }

    override fun claimCheck(now: Instant, dueBefore: Instant): Boolean =
        dsl.update(MATCH_FEED)
            .set(MATCH_FEED.LAST_CHECKED_AT, now.atOffset(ZoneOffset.UTC))
            .where(MATCH_FEED.ID.eq(SINGLETON_ID))
            .and(MATCH_FEED.LAST_CHECKED_AT.isNull.or(MATCH_FEED.LAST_CHECKED_AT.lt(dueBefore.atOffset(ZoneOffset.UTC))))
            .execute() == 1

    @Transactional
    override fun recordSuccess(matches: List<FeedMatch>) {
        dsl.update(MATCH_FEED).set(MATCH_FEED.LAST_CHECK_FAILED, false).execute()
        replaceMatches(matches)
    }

    override fun recordFailure() {
        dsl.update(MATCH_FEED).set(MATCH_FEED.LAST_CHECK_FAILED, true).execute()
    }

    override fun matches(): List<FeedMatch> =
        dsl.selectFrom(MATCH_FEED_MATCHES)
            .orderBy(MATCH_FEED_MATCHES.START_TIME, MATCH_FEED_MATCHES.CODE)
            .fetch {
                FeedMatch(
                    code = MatchCode(it.code),
                    link = MatchLink(it.link),
                    startTime = it.startTime.toInstant(),
                    homeTeam = NevoboTeamName(it.homeTeam),
                    awayTeam = NevoboTeamName(it.awayTeam),
                    venue = it.venue?.let(::MatchVenue),
                    address = it.address?.let(::MatchAddress),
                )
            }

    private fun replaceMatches(matches: List<FeedMatch>) {
        dsl.deleteFrom(MATCH_FEED_MATCHES).execute()
        if (matches.isEmpty()) return
        dsl.batch(
            matches.distinctBy { it.code }.map {
                dsl.insertInto(MATCH_FEED_MATCHES)
                    .set(MATCH_FEED_MATCHES.CODE, it.code.value)
                    .set(MATCH_FEED_MATCHES.LINK, it.link.value)
                    .set(MATCH_FEED_MATCHES.START_TIME, it.startTime.atOffset(ZoneOffset.UTC))
                    .set(MATCH_FEED_MATCHES.HOME_TEAM, it.homeTeam.value)
                    .set(MATCH_FEED_MATCHES.AWAY_TEAM, it.awayTeam.value)
                    .set(MATCH_FEED_MATCHES.VENUE, it.venue?.value)
                    .set(MATCH_FEED_MATCHES.ADDRESS, it.address?.value)
            },
        ).execute()
    }
}
