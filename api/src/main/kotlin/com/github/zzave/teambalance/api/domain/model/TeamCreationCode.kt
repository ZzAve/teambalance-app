package com.github.zzave.teambalance.api.domain.model

import java.time.Instant

/**
 * A platform-level one-time code that gates self-service team creation (#154, ADR-0019). The
 * read-side projection surfaced by the codes-admin CRUD (Slice 4); consumption itself is the atomic
 * UPDATE inside team registration, not modelled here.
 *
 * A code is redeemable while [consumedAt] is null and it is unexpired ([expiresAt] null or future).
 * [createdTeamId] records which team the code produced once redeemed (null until then).
 *
 * The two spent-code references are the identity types the rest of the domain already speaks
 * ([UserId]/[TeamId]) rather than bare UUIDs: they sit side by side and were interchangeable, so a
 * row mapper or a DTO could transpose them and still compile. Converted only at the JDBC and
 * Wirespec edges, like every other identity here.
 */
data class TeamCreationCode(
    val code: CreationCode,
    val createdAt: Instant,
    val expiresAt: Instant?,
    val consumedAt: Instant?,
    val consumedByUserId: UserId?,
    val createdTeamId: TeamId?,
)
