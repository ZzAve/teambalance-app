package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User

interface MagicLinkTokenRepository {
    fun save(token: MagicLinkToken): MagicLinkToken
    fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken?

    /**
     * Persists [consumedToken] (its `usedAt` already stamped by the caller) and returns the user for
     * its email, creating one with [displayName] if none exists — as ONE unit. If user resolution
     * fails the token stays unused, so a single-use magic link is never burned without producing a
     * signed-in user.
     *
     * Sign-in is one of the two operations whose atomicity spans two aggregates (`magic_link_tokens`
     * and `users`); it is expressed as a single port call so the application states the intent and
     * the adapter makes it atomic, keeping "one port call is one transaction" intact.
     */
    fun consumeAndResolveUser(consumedToken: MagicLinkToken, displayName: DisplayName): User
}
