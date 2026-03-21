package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Event
import java.time.Instant
import java.util.UUID

interface EventRepository {
    fun findById(id: UUID): Event?
    fun findUpcoming(since: Instant): List<Event>
    fun findAll(): List<Event>
    fun save(event: Event): Event
    fun deleteById(id: UUID)
}
