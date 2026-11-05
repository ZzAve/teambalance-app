package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.tables.records.UsersRecord
import org.jooq.DSLContext
import org.jooq.impl.DSL.excluded
import org.springframework.stereotype.Repository

@Repository
class JooqUserRepositoryAdapter(
    private val dsl: DSLContext,
) : UserRepository {

    override fun findById(id: UserId): User? =
        dsl.selectFrom(USERS).where(USERS.ID.eq(id.value)).fetchOne()?.toUser()

    override fun findByEmail(email: Email): User? =
        dsl.selectFrom(USERS).where(USERS.EMAIL.eq(email.value)).fetchOne()?.toUser()

    override fun save(user: User): User {
        dsl.insertInto(USERS)
            .set(USERS.ID, user.id.value)
            .set(USERS.EMAIL, user.email.value)
            .set(USERS.DISPLAY_NAME, user.displayName.value)
            .onConflict(USERS.ID)
            .doUpdate()
            .set(USERS.EMAIL, excluded(USERS.EMAIL))
            .set(USERS.DISPLAY_NAME, excluded(USERS.DISPLAY_NAME))
            .execute()
        return user
    }

    // A bare column rather than a field of User: keeping it off the domain object stops a stale
    // in-memory User from overwriting a switch made on another device.
    override fun findLastActiveTeamId(userId: UserId): TeamId? =
        dsl.select(USERS.LAST_ACTIVE_TEAM_ID)
            .from(USERS)
            .where(USERS.ID.eq(userId.value))
            .fetchOne(USERS.LAST_ACTIVE_TEAM_ID)
            ?.let(::TeamId)

    override fun rememberActiveTeam(userId: UserId, teamId: TeamId) {
        dsl.update(USERS)
            .set(USERS.LAST_ACTIVE_TEAM_ID, teamId.value)
            .where(USERS.ID.eq(userId.value))
            .execute()
    }
}

internal fun UsersRecord.toUser() = User(
    id = UserId(id),
    email = Email(email),
    displayName = DisplayName(displayName),
)
