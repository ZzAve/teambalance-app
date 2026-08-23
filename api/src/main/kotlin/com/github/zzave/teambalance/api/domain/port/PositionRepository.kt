package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel

/**
 * Positions of the current tenant (ADR-0025). No method takes a team id: positions are tenant rows,
 * so the resolved schema already says which team's vocabulary this is. Passing one would invite the
 * caller to name a team other than the one the connection is routed to — the exact divergence
 * ADR-0023 removed from tenant resolution.
 */
interface PositionRepository {
    /** All positions of the current tenant, ordered by label. */
    fun list(): List<Position>

    /** Creates a new position and returns it. */
    fun create(label: PositionLabel): Position

    /** Renames an existing position and returns the updated value. */
    fun rename(id: PositionId, label: PositionLabel): Position

    /**
     * Deletes a position. Members assigned to it become unassigned by the `member_positions`
     * foreign key's ON DELETE CASCADE, rather than by a prior clearing statement.
     */
    fun delete(id: PositionId)

    fun findById(id: PositionId): Position?

    /** True if [positionId] names a position of the current tenant. */
    fun exists(positionId: PositionId): Boolean
}
