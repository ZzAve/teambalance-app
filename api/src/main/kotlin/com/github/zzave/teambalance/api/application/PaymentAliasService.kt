package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.PaymentAliasNotFoundException
import com.github.zzave.teambalance.api.domain.model.Iban
import com.github.zzave.teambalance.api.domain.model.PaymentAlias
import com.github.zzave.teambalance.api.domain.model.PaymentAliasId
import com.github.zzave.teambalance.api.domain.model.PaymentAliasName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PaymentAliasRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

/**
 * A member's payment aliases (ADR-0045). Only the member who owns them and a team Admin may read or
 * write them; there is no way to read another member's alias without that, and the aliases never
 * leave this service except to the owner or an Admin (the money pool reads them through [PaymentAliasRepository]
 * to attribute payments and returns only the member id).
 */
class PaymentAliasService(
    private val paymentAliasRepository: PaymentAliasRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val authorizationService: AuthorizationService,
) {
    fun list(callerId: UserId, teamId: TeamId, ownerId: UserId): List<PaymentAlias> {
        requireMayManage(callerId, teamId, ownerId)
        return paymentAliasRepository.findByUser(ownerId)
    }

    fun create(callerId: UserId, teamId: TeamId, ownerId: UserId, name: String?, iban: String?): PaymentAlias {
        requireMayManage(callerId, teamId, ownerId)
        return aliasOf(PaymentAliasId.random(), ownerId, name, iban).also(paymentAliasRepository::insert)
    }

    /** Stores an alias already checked by the caller of this method (the claim of a payment): no authorization here. */
    fun add(alias: PaymentAlias): PaymentAlias = alias.also(paymentAliasRepository::insert)

    /**
     * An omitted [name] keeps the stored name, a blank one removes it, another replaces it. The IBAN is write-only
     * (ADR-0045), so the caller cannot send back the stored one: no [iban] keeps it, a new one replaces it, [clearIban]
     * removes it; both together are refused.
     */
    @Suppress("LongParameterList")
    fun update(
        callerId: UserId,
        teamId: TeamId,
        ownerId: UserId,
        id: PaymentAliasId,
        name: String?,
        iban: String?,
        clearIban: Boolean,
    ): PaymentAlias {
        requireMayManage(callerId, teamId, ownerId)
        val stored = paymentAliasRepository.findByUser(ownerId).firstOrNull { it.id == id } ?: throw PaymentAliasNotFoundException(id)
        // IllegalArgumentException is a 400 at the edge.
        require(!clearIban || iban.isNullOrBlank()) { "Send either a new IBAN or clearIban, not both" }
        val newIban = when {
            clearIban -> null
            iban.isNullOrBlank() -> stored.iban
            else -> Iban.parse(iban)
        }
        val newName = when {
            name == null -> stored.name
            name.isBlank() -> null
            else -> PaymentAliasName.parse(name)
        }
        val alias = PaymentAlias(id, ownerId, newName, newIban)
        if (!paymentAliasRepository.update(alias)) throw PaymentAliasNotFoundException(id)
        return alias
    }

    fun delete(callerId: UserId, teamId: TeamId, ownerId: UserId, id: PaymentAliasId) {
        requireMayManage(callerId, teamId, ownerId)
        if (!paymentAliasRepository.delete(ownerId, id)) throw PaymentAliasNotFoundException(id)
    }

    private fun aliasOf(id: PaymentAliasId, ownerId: UserId, name: String?, iban: String?) = PaymentAlias(
        id = id,
        userId = ownerId,
        name = name?.takeIf(String::isNotBlank)?.let(PaymentAliasName::parse),
        iban = iban?.takeIf(String::isNotBlank)?.let(Iban::parse),
    )

    // Owner: themselves. Anyone else: an Admin. Either way the owner must have a team_members row (404 otherwise),
    // which a Platform Admin acting as the team does not: their Virtual Member must not hold aliases.
    fun requireMayManage(callerId: UserId, teamId: TeamId, ownerId: UserId) {
        if (callerId == ownerId) {
            authorizationService.requireMember(callerId, teamId)
        } else {
            authorizationService.requireAdmin(callerId, teamId)
        }
        teamMemberRepository.findRole(teamId, ownerId) ?: throw MemberNotFoundException(ownerId)
    }
}
