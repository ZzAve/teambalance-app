package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/** The tenant's singleton Bunq connection; no row means not connected (see V018__money_pool.sql). */
@Entity
@Table(name = "bunq_connection")
class BunqConnectionJpaEntity(
    @Id
    val id: Short = SINGLETON_ID,
    @Column(name = "bunq_account_id", nullable = false)
    val bunqAccountId: String,
) {
    companion object {
        const val SINGLETON_ID: Short = 1
    }
}
