package com.github.zzave.teambalance.api.domain.model

import java.time.Instant

/** The credential id of a [Passkey], base64url: the string Spring Security's `DELETE /webauthn/register/{id}` takes. */
@JvmInline
value class PasskeyId(val value: String)

/** What the person sees the passkey as in their list. */
@JvmInline
value class PasskeyLabel(val value: String)

/** A WebAuthn credential a person registered, as shown on their Account tab (ADR-0045). */
data class Passkey(
    val id: PasskeyId,
    val label: PasskeyLabel,
    val createdAt: Instant,
    val lastUsedAt: Instant?,
)
