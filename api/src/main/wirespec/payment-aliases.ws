// How a member appears on Bunq payments, so the money pool can attribute an incoming payment to them (ADR-0045). A row has a name, an IBAN or both. Visible and editable only by the member who owns it and by team Admins; anyone else gets 403. The IBAN is write-only: no response returns it in full, to anyone. ibanMasked shows the country and check digits and the last four characters (`NL02 •••• •••• ••67 89`), null when there is no IBAN; hasIban says the same.
type PaymentAlias {
    id: String,
    name: String?,
    ibanMasked: String?,
    hasIban: Boolean
}

type PaymentAliasList {
    aliases: PaymentAlias[]
}

// At least one of name and iban is required (400). A name is trimmed, 1..100 characters. A bad IBAN (format or mod-97 check) is 400 INVALID_IBAN. 409 PAYMENT_ALIAS_TAKEN when another alias in the team has the same name (case-insensitive) or the same IBAN.
type PaymentAliasRequest {
    name: String?,
    iban: String?
}

endpoint ListPaymentAliases GET /api/members/{userId: String}/payment-aliases -> {
    200 -> PaymentAliasList
    403 -> Unit
    404 -> Unit
}

endpoint CreatePaymentAlias POST PaymentAliasRequest /api/members/{userId: String}/payment-aliases -> {
    201 -> PaymentAlias
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

// Name and IBAN work alike: omitted (or null) keeps the stored value, a value replaces it, an empty name removes the name, and `clearIban: true` removes the IBAN (the IBAN cannot be read back, so it has its own flag). `iban` together with `clearIban: true` is 400, as is a bad IBAN (INVALID_IBAN). The result must still have a name or an IBAN (400). 409 PAYMENT_ALIAS_TAKEN as for create.
type UpdatePaymentAliasRequest {
    name: String?,
    iban: String?,
    clearIban: Boolean?
}

endpoint UpdatePaymentAlias PUT UpdatePaymentAliasRequest /api/members/{userId: String}/payment-aliases/{aliasId: String} -> {
    200 -> PaymentAlias
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint DeletePaymentAlias DELETE /api/members/{userId: String}/payment-aliases/{aliasId: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
}

// "That's mine": records an alias for userId from the counterparty of a payment in the money pool, found by its id. The IBAN is read on the server and never sent to the client. The answer is the new alias with the IBAN masked. useName and useIban say which parts to store (both default to true). With the defaults, a counterparty name that cannot be an alias name (empty, over 100 characters) is left out and the IBAN is stored alone; a name asked for explicitly, or the only part left, that cannot be stored is 400, as is an alias with no part at all. A member claims for themselves; an Admin for any member of the team; anyone else gets 403. 404: no such payment in the pool, or the user is not a member. 409 MONEY_POOL_NOT_READABLE: the pool is off, not connected or rejected by Bunq. 503: Bunq did not answer. 409 PAYMENT_NOT_CLAIMABLE: the payment is not incoming or is already attributed to a member; 409 PAYMENT_ALIAS_TAKEN as for any alias.
type ClaimPaymentRequest {
    userId: String,
    useName: Boolean?,
    useIban: Boolean?
}

endpoint ClaimPayment POST ClaimPaymentRequest /api/team/money-pool/payments/{paymentId: String}/claim -> {
    201 -> PaymentAlias
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
    503 -> Unit
}
