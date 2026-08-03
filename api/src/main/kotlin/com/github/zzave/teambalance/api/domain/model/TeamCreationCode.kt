package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

/**
 * A platform-level one-time code that gates self-service team creation (#154, ADR-0015). The
 * read-side projection surfaced by the codes-admin CRUD (Slice 4); consumption itself is the atomic
 * UPDATE inside team registration, not modelled here.
 *
 * A code is redeemable while [consumedAt] is null and it is unexpired ([expiresAt] null or future).
 * [createdTeamId] records which team the code produced once redeemed (null until then).
 */
data class TeamCreationCode(
    val code: String,
    val createdAt: Instant,
    val expiresAt: Instant?,
    val consumedAt: Instant?,
    val consumedByUserId: UUID?,
    val createdTeamId: UUID?,
)
