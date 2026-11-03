package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BeerPrice
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MONEY_POOL_SETTINGS
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

private const val SINGLETON_ID: Short = 1

@Repository
class JooqMoneyPoolSettingsRepositoryAdapter(
    private val dsl: DSLContext,
) : MoneyPoolSettingsRepository {

    override fun get(): MoneyPoolSettings =
        dsl.selectFrom(MONEY_POOL_SETTINGS)
            .where(MONEY_POOL_SETTINGS.ID.eq(SINGLETON_ID))
            .fetchOne()
            ?.let {
                MoneyPoolSettings(
                    enabled = it.enabled,
                    beerPrice = it.beerPriceCents?.let { cents -> BeerPrice(cents.toLong()) },
                    bunqMeLink = it.bunqMeLink?.let(BunqMeLink::restore),
                )
            }
            ?: MoneyPoolSettings(enabled = true)

    // The migration seeds id=1; the upsert also covers a tenant whose row is missing.
    override fun save(settings: MoneyPoolSettings): MoneyPoolSettings {
        val beerPriceCents = settings.beerPrice?.cents?.toInt()
        val bunqMeLink = settings.bunqMeLink?.value
        dsl.insertInto(MONEY_POOL_SETTINGS)
            .set(MONEY_POOL_SETTINGS.ID, SINGLETON_ID)
            .set(MONEY_POOL_SETTINGS.ENABLED, settings.enabled)
            .set(MONEY_POOL_SETTINGS.BEER_PRICE_CENTS, beerPriceCents)
            .set(MONEY_POOL_SETTINGS.BUNQ_ME_LINK, bunqMeLink)
            .onConflict(MONEY_POOL_SETTINGS.ID)
            .doUpdate()
            .set(MONEY_POOL_SETTINGS.ENABLED, settings.enabled)
            .set(MONEY_POOL_SETTINGS.BEER_PRICE_CENTS, beerPriceCents)
            .set(MONEY_POOL_SETTINGS.BUNQ_ME_LINK, bunqMeLink)
            .execute()
        return settings
    }
}
