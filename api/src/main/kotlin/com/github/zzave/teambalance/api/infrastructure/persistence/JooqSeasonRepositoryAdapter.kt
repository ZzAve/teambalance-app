package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.TEAM_SETTINGS
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

private const val SINGLETON_ID: Short = 1

@Repository
class JooqSeasonRepositoryAdapter(
    private val dsl: DSLContext,
) : SeasonRepository {

    override fun get(): Season =
        dsl.selectFrom(TEAM_SETTINGS)
            .where(TEAM_SETTINGS.ID.eq(SINGLETON_ID))
            .fetchOne()
            ?.let { Season(start = it.seasonStart, end = it.seasonEnd) }
            ?: Season.UNSET

    // The migration seeds id=1; the upsert also covers a tenant whose row is missing.
    override fun save(season: Season): Season {
        dsl.insertInto(TEAM_SETTINGS)
            .set(TEAM_SETTINGS.ID, SINGLETON_ID)
            .set(TEAM_SETTINGS.SEASON_START, season.start)
            .set(TEAM_SETTINGS.SEASON_END, season.end)
            .onConflict(TEAM_SETTINGS.ID)
            .doUpdate()
            .set(TEAM_SETTINGS.SEASON_START, season.start)
            .set(TEAM_SETTINGS.SEASON_END, season.end)
            .execute()
        return season
    }
}
