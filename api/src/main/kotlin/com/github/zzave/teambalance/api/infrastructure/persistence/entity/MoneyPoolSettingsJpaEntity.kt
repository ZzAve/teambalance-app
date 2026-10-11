package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/** The tenant's singleton money pool switch (see V018__money_pool.sql). */
@Entity
@Table(name = "money_pool_settings")
class MoneyPoolSettingsJpaEntity(
    @Id
    val id: Short = SINGLETON_ID,
    @Column(name = "enabled", nullable = false)
    val enabled: Boolean,
) {
    companion object {
        const val SINGLETON_ID: Short = 1
    }
}
