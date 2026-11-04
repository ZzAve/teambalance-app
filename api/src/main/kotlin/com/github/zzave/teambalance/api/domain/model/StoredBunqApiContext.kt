package com.github.zzave.teambalance.api.domain.model

/**
 * What the current team's Bunq connection row holds for the API session: the [grant] the row belongs to, and the
 * encrypted [context] stored for it, if any. A caller compares the grant before trusting or replacing the context.
 */
data class StoredBunqApiContext(val grant: EncryptedToken, val context: EncryptedToken?)
