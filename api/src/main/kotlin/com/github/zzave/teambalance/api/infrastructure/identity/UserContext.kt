package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.exception.UnauthenticatedException
import java.util.UUID

object UserContext {
    private val current = ThreadLocal<UUID>()

    fun set(userId: UUID) = current.set(userId)
    fun get(): UUID? = current.get()
    fun require(): UUID = current.get() ?: throw UnauthenticatedException("No user in context")
    fun clear() = current.remove()
}
