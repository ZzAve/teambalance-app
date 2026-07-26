package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamSettingsJpaEntity
import org.springframework.stereotype.Repository

@Repository
class JpaSeasonRepositoryAdapter(
    private val jpaRepository: SpringDataTeamSettingsRepository,
) : SeasonRepository {

    override fun get(): Season =
        jpaRepository.findById(TeamSettingsJpaEntity.SINGLETON_ID)
            .map { Season(start = it.seasonStart, end = it.seasonEnd) }
            .orElse(Season.UNSET)

    // Upsert the singleton row: the migration seeds id=1, so save() merges the season bounds onto it.
    override fun save(season: Season): Season {
        jpaRepository.save(
            TeamSettingsJpaEntity(
                id = TeamSettingsJpaEntity.SINGLETON_ID,
                seasonStart = season.start,
                seasonEnd = season.end,
            ),
        )
        return season
    }
}
