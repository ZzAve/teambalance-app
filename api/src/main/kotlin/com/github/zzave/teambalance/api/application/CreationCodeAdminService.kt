package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CreationCodeConsumedException
import com.github.zzave.teambalance.api.domain.exception.CreationCodeNotFoundException
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import java.security.SecureRandom
import java.time.Clock
import java.time.Instant

/**
 * Platform-admin CRUD over the one-time team-creation codes (#154 Slice 4). Every operation is gated
 * on [PlatformAdminGateway] with the authenticated caller — the empty-allowlist default forbids
 * everyone (fail-closed).
 *
 * SECURITY CONTRACT: [callerId] MUST be the authenticated principal (resolved from the session by the
 * controller), never a request-supplied id.
 */
class CreationCodeAdminService(
    private val creationCodeRepository: TeamCreationCodeRepository,
    private val platformAdminGateway: PlatformAdminGateway,
    private val clock: Clock,
) {
    fun list(callerId: UserId): List<TeamCreationCode> {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        return creationCodeRepository.findAll()
    }

    fun create(callerId: UserId, expiresAt: Instant?): TeamCreationCode {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        return creationCodeRepository.insert(generateCode(), clock.instant(), expiresAt)
    }

    /**
     * Revokes an unconsumed code by deleting it. A missing code is a 404; a consumed one is a 409 —
     * consuming is irreversible, so it can't be "revoked". Only unconsumed codes actually leave.
     */
    fun revoke(callerId: UserId, code: String) {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        val existing = creationCodeRepository.findByCode(code) ?: throw CreationCodeNotFoundException(code)
        if (existing.consumedAt != null) throw CreationCodeConsumedException(code)
        creationCodeRepository.delete(code)
    }

    // A short, human-typable, unguessable code: three dash-separated groups from an unambiguous
    // alphabet (no 0/O/1/I), e.g. "K7QM-9FX4-P2HR". ~60 bits of entropy — brute-forcing it is
    // hopeless, and the code gate is the last line anyway (the redeem UPDATE is atomic + one-shot).
    private fun generateCode(): String =
        (0 until GROUP_COUNT).joinToString("-") { randomGroup() }

    private fun randomGroup(): String =
        buildString { repeat(GROUP_SIZE) { append(ALPHABET[random.nextInt(ALPHABET.length)]) } }

    private companion object {
        private const val ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        private const val GROUP_COUNT = 3
        private const val GROUP_SIZE = 4
        private val random = SecureRandom()
    }
}
