package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

/** The tenant's singleton Bunq connection; no row means not connected (see V018, V020, V021). */
@Entity
@Table(name = "bunq_connection")
class BunqConnectionJpaEntity(
    @Id
    val id: Short = SINGLETON_ID,
    @Column(name = "bunq_account_id")
    val bunqAccountId: String?,
    @Column(name = "connected_at", nullable = false)
    val connectedAt: Instant,
    @Column(name = "access_token_encrypted", nullable = false)
    val accessTokenEncrypted: String,
    /** Audit only: who connected it. No foreign key, and nothing is granted to that user. */
    @Column(name = "connected_by", nullable = false)
    val connectedBy: UUID,
) {
    companion object {
        const val SINGLETON_ID: Short = 1
    }
}
