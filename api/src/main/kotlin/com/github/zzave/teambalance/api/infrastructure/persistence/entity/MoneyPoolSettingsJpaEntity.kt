package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/** The tenant's singleton money pool settings (see V018__money_pool.sql, V019). */
@Entity
@Table(name = "money_pool_settings")
class MoneyPoolSettingsJpaEntity(
    @Id
    val id: Short = SINGLETON_ID,
    @Column(name = "enabled", nullable = false)
    val enabled: Boolean,
    @Column(name = "beer_price_cents")
    val beerPriceCents: Int? = null,
    @Column(name = "bunq_me_link")
    val bunqMeLink: String? = null,
) {
    companion object {
        const val SINGLETON_ID: Short = 1
    }
}
