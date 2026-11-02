package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

/**
 * The picture a member is shown with **in this team** (ADR-0038) — a tenant row, kept apart from
 * [MemberProfileJpaEntity] so loading a profile never loads image bytes.
 *
 * `userId` names a `public.users` row without a foreign key, for the same reason the profile does.
 */
@Entity
@Table(name = "member_photos")
class MemberPhotoJpaEntity(
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
