package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPaymentAliasException

/** Builds the alias a "That's mine" claim stores from a payment's counterparty (ADR-0045). */
object PaymentClaim {
    /**
     * [useName] and [useIban] say which parts to keep; null means the default, both. A name that cannot be an alias
     * name (blank, or over [PaymentAliasName.MAX_LENGTH]) is left out when the name was only the default, so the IBAN
     * is stored alone. When the name was asked for (`useName = true`, or the IBAN was switched off) it is a 400.
     * An alias with neither part is a 400.
     */
    fun aliasOf(owner: UserId, payment: Payment, useName: Boolean?, useIban: Boolean?): PaymentAlias {
        val wantName = useName != false
        val wantIban = useIban != false
        val name = if (wantName) PaymentAliasName.parseOrNull(payment.name.value) else null
        val nameRequired = useName == true || !wantIban
        if (wantName && name == null && nameRequired) {
            throw InvalidPaymentAliasException("The payment's name is empty or longer than ${PaymentAliasName.MAX_LENGTH} characters")
        }
        return PaymentAlias(PaymentAliasId.random(), owner, name, payment.counterpartyIban.takeIf { wantIban })
    }
}
