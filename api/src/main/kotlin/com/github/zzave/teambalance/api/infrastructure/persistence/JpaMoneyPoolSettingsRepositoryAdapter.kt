package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MoneyPoolSettingsJpaEntity
import org.springframework.stereotype.Repository

@Repository
class JpaMoneyPoolSettingsRepositoryAdapter(
    private val jpaRepository: SpringDataMoneyPoolSettingsRepository,
) : MoneyPoolSettingsRepository {

    override fun get(): MoneyPoolSettings =
        jpaRepository.findById(MoneyPoolSettingsJpaEntity.SINGLETON_ID)
            .map { MoneyPoolSettings(enabled = it.enabled) }
            .orElse(MoneyPoolSettings(enabled = true))
}
