package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

/**
 * A calendar link, in the tenant schema (ADR-0032). Deliberately unqualified: no `schema = "public"`,
 * so it routes through the tenant connection like every other team-owned entity. There is no team id
 * column — the schema is the team, and that is what scopes a token lookup to one team's links.
 */
@Entity
@Table(name = "calendar_links")
class CalendarLinkJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(name = "token_hash", nullable = false, unique = true)
    val tokenHash: String = "",
    @Column(name = "token_encrypted", nullable = false)
    val tokenEncrypted: String = "",
    @Column(name = "label")
    val label: String? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.EPOCH,
)
