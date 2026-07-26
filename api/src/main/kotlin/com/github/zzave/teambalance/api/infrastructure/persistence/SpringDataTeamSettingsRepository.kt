package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamSettingsJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataTeamSettingsRepository : JpaRepository<TeamSettingsJpaEntity, Short>
