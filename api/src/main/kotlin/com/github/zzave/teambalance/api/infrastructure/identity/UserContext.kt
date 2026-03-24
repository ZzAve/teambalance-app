package com.github.zzave.teambalance.api.infrastructure.identity

import java.util.UUID

object UserContext {
    private val current = ThreadLocal<UUID>()

    fun set(userId: UUID) = current.set(userId)
    fun get(): UUID? = current.get()
    fun require(): UUID = current.get() ?: throw IllegalStateException("No user in context")
    fun clear() = current.remove()
}
