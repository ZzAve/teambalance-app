package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.PaymentAlias
import com.github.zzave.teambalance.api.domain.model.PaymentAliasId
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * Payment aliases of the routed tenant schema (ADR-0046), so no method takes a team id. [insert] and
 * [update] throw PaymentAliasTakenException when another alias has the same name (case-insensitive)
 * or the same IBAN.
 */
interface PaymentAliasRepository {
    fun findByUser(userId: UserId): List<PaymentAlias>

    /** Every alias of the team, for attributing payments. Never return this to a caller. */
    fun findAll(): List<PaymentAlias>
    fun insert(alias: PaymentAlias)

    /** Replaces name and IBAN of the alias [id] owned by [userId]; false when there is no such alias. */
    fun update(alias: PaymentAlias): Boolean

    /** False when [userId] owns no alias [id]. */
    fun delete(userId: UserId, id: PaymentAliasId): Boolean
}
