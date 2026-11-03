package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionKind
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.POSITIONS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.PositionsRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.util.UUID

/**
 * Positions, tenant-schema rows since ADR-0026 — so every query here is
 * scoped by the routed connection rather than by a team id predicate. Assignments live with member
 * edits (JooqTeamMemberRepositoryAdapter), which must write name, role and position in one call.
 */
@Repository
class JooqPositionRepositoryAdapter(
    private val dsl: DSLContext,
) : PositionRepository {

    override fun list(): List<Position> =
        dsl.selectFrom(POSITIONS).orderBy(POSITIONS.LABEL.asc()).fetch { it.toDomain() }

    override fun create(label: PositionLabel): Position =
        checkNotNull(
            dsl.insertInto(POSITIONS)
                .set(POSITIONS.ID, UUID.randomUUID())
                .set(POSITIONS.LABEL, label.value)
                .returning()
                .fetchOne(),
        ).toDomain()

    override fun rename(id: PositionId, label: PositionLabel): Position =
        dsl.update(POSITIONS)
            .set(POSITIONS.LABEL, label.value)
            .where(POSITIONS.ID.eq(id.value))
            .returning()
            .fetchOne()
            ?.toDomain()
            ?: throw IllegalStateException("Position $id disappeared during rename")

    override fun setKind(id: PositionId, kind: PositionKind): Position =
        dsl.update(POSITIONS)
            .set(POSITIONS.KIND, kind.name)
            .where(POSITIONS.ID.eq(id.value))
            .returning()
            .fetchOne()
            ?.toDomain()
            ?: throw IllegalStateException("Position $id disappeared while setting its kind")

    /**
     * No prior clearing statement: `member_profiles.position_id` is a real foreign key with
     * ON DELETE SET NULL, so assigned members become unassigned as part of this delete rather than
     * by a separate write that could be skipped or fail in between — and they keep their name,
     * which a cascade would have deleted along with the row. That guarantee is the point of
     * moving positions into the tenant schema — before, the two tables sat in different schemas and
     * no foreign key could span them.
     */
    override fun delete(id: PositionId) {
        dsl.deleteFrom(POSITIONS).where(POSITIONS.ID.eq(id.value)).execute()
    }

    override fun findById(id: PositionId): Position? =
        dsl.selectFrom(POSITIONS).where(POSITIONS.ID.eq(id.value)).fetchOne()?.toDomain()

    override fun exists(positionId: PositionId): Boolean =
        dsl.fetchExists(POSITIONS, POSITIONS.ID.eq(positionId.value))

    private fun PositionsRecord.toDomain() =
        Position(id = PositionId(id), label = PositionLabel(label), kind = PositionKind.valueOf(kind))
}
