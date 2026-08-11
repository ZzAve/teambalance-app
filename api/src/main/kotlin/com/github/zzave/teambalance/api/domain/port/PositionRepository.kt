package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.TeamId
import java.util.UUID

interface PositionRepository {
    /** All positions of the team, ordered by label. */
    fun listByTeam(teamId: TeamId): List<Position>

    /** Creates a new position for the team and returns it. */
    fun create(teamId: TeamId, label: PositionLabel): Position

    /** Renames an existing position and returns the updated value. */
    fun rename(id: PositionId, label: PositionLabel): Position

    /** Deletes a position, first clearing it from any members assigned to it. */
    fun delete(id: PositionId)

    fun findById(id: PositionId): Position?

    /** True if [positionId] identifies a position owned by [teamId]. */
    fun existsInTeam(teamId: TeamId, positionId: PositionId): Boolean
}
