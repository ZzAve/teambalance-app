package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

/**
 * A single Reference row in the `event_references` collection table. Ordered by an `@OrderColumn`
 * on the owning [EventJpaEntity], so the stored `position` mirrors the domain list order.
 */
@Embeddable
class EventReferenceEmbeddable(
    @Column(name = "title", length = 100)
    val title: String?,
    @Column(name = "url", nullable = false, length = 2048)
    val url: String,
)
