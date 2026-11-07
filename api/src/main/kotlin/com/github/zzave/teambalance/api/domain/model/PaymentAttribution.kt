package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * Decides which member paid (ADR-0045). The signals, strongest first: the description is a top-up
 * description ([TopUpDescription]) whose user id belongs to a current member; the counterparty IBAN
 * equals a member's alias IBAN; the counterparty name equals a member's alias name (ignoring capitals and
 * white space). Nothing matches: null.
 */
object PaymentAttribution {
    // Only money coming in is a contribution; a payment out is never attributed.
    fun memberOf(payment: Payment, aliases: List<PaymentAlias>, members: Set<UserId>): UserId? =
        if (payment.direction != PaymentDirection.IN) {
            null
        } else {
            byDescription(payment, members) ?: byIban(payment, aliases) ?: byName(payment, aliases)
        }

    private fun byIban(payment: Payment, aliases: List<PaymentAlias>): UserId? =
        payment.counterpartyIban?.let { iban -> aliases.firstOrNull { it.iban == iban }?.userId }

    private fun byName(payment: Payment, aliases: List<PaymentAlias>): UserId? {
        val key = PaymentAliasName.keyOf(payment.name.value).ifEmpty { return null }
        return aliases.firstOrNull { it.name?.let { n -> PaymentAliasName.keyOf(n.value) } == key }?.userId
    }

    // The id must be a current member, so a made-up one attributes to nobody.
    private fun byDescription(payment: Payment, members: Set<UserId>): UserId? {
        val description = payment.description?.value?.takeIf { it.startsWith(TopUpDescription.PREFIX) } ?: return null
        val id = runCatching { UUID.fromString(description.substringAfterLast(TopUpDescription.SEPARATOR).trim()) }.getOrNull()
        return id?.let(::UserId)?.takeIf { it in members }
    }
}
