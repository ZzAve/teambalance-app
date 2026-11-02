package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

/** A person's own picture (ADR-0038) — a platform row, independent of any team. */
@Entity
@Table(name = "personal_photos", schema = "public")
class PersonalPhotoJpaEntity(
    @Id
    @Column(name = "user_id")
    val userId: UUID = UUID.randomUUID(),
    @Column(name = "image", nullable = false)
    var image: ByteArray = ByteArray(0),
    @Column(name = "version", nullable = false)
    var version: String = "",
    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
)
