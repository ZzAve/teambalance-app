package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import java.time.Instant
import java.util.UUID

/**
 * The atomic write half of create-team: in a single transaction it consumes the creation code and
 * inserts the new team plus its founding ADMIN member. Splitting this from provisioning keeps the
 * provision-first ordering — the tenant schema is created (idempotently, on its own connection) before
 * this commits, so a failure here leaves at worst a harmless empty orphan schema (the startup runner
 * self-heals it) and never a consumed code without a team.
 */
interface TeamRegistrationGateway {
    /**
     * Atomically: consume [creationCode] (conditional on it still being redeemable at [now]), insert
     * the team ([name]/[slug]/[schemaName]), and insert [founderId] as its ADMIN with onboarding
     * already complete ([now]). Returns the new team id. Writes nothing on failure.
     *
     * @throws com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
     *   if the code was no longer redeemable at commit time (a race lost the code).
     * @throws com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
     *   if the slug / schema name collides with an existing team.
     */
    fun register(
        creationCode: CreationCode,
        founderId: UUID,
        name: TeamName,
        slug: Slug,
        schemaName: SchemaName,
        now: Instant,
    ): TeamId

    /**
     * Inserts the team ([name]/[slug]/[schemaName]) with **no `team_members` row and no creation code**
     * — the memberless creation of ADR-0024 §5. [createdBy] is the Platform Admin, recorded as the
     * team's creator for provenance ([now] as `created_at`); it is deliberately *not* made a member,
     * because the platform account is structurally teamless (ADR-0024 §3). Returns the new team id.
     *
     * Kept a separate method rather than a nullable founder on [register]: "insert no member" must not
     * be reachable from the ordinary self-service path, where the founder always becomes the admin.
     *
     * @throws com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
     *   if the slug / schema name collides with an existing team.
     */
    fun registerMemberless(
        createdBy: UUID,
        name: TeamName,
        slug: Slug,
        schemaName: SchemaName,
        now: Instant,
    ): TeamId
}
