package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BeerPrice
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
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
            .map {
                MoneyPoolSettings(
                    enabled = it.enabled,
                    beerPrice = it.beerPriceCents?.let { cents -> BeerPrice(cents.toLong()) },
                    bunqMeLink = it.bunqMeLink?.let(BunqMeLink::parse),
                )
            }
            .orElse(MoneyPoolSettings(enabled = true))

    // The migration seeds id=1, so save() merges the settings onto it.
    override fun save(settings: MoneyPoolSettings): MoneyPoolSettings {
        jpaRepository.save(
            MoneyPoolSettingsJpaEntity(
                enabled = settings.enabled,
                beerPriceCents = settings.beerPrice?.cents?.toInt(),
                bunqMeLink = settings.bunqMeLink?.value,
            ),
        )
        return settings
    }
}
