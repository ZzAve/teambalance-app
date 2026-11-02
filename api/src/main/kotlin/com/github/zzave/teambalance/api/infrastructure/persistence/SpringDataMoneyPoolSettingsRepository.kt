package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MoneyPoolSettingsJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataMoneyPoolSettingsRepository : JpaRepository<MoneyPoolSettingsJpaEntity, Short>
