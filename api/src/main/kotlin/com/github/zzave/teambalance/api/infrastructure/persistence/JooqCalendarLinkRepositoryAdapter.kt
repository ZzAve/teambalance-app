package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarLinkOptions
import com.github.zzave.teambalance.api.domain.model.CalendarNameSuffix
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.CALENDAR_LINKS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.CALENDAR_LINK_ATTENDANCE_STATES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.CALENDAR_LINK_EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.CalendarLinksRecord
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset
import java.util.UUID

/**
 * Calendar links, tenant-schema rows (ADR-0039) — every query here is scoped by the routed connection
 * rather than by a team id predicate, exactly as [JpaPositionRepositoryAdapter] is.
 *
 * A link is stored across three tables: the row itself, its attendance states and its event-type
 * allowlist. Reads are `@Transactional(readOnly = true)` so the three selects see one snapshot.
 */
@Repository
class JooqCalendarLinkRepositoryAdapter(
    private val dsl: DSLContext,
) : CalendarLinkRepository {

    @Transactional(readOnly = true)
    override fun findByUser(userId: UserId): List<CalendarLink> =
        dsl.selectFrom(CALENDAR_LINKS)
            .where(CALENDAR_LINKS.USER_ID.eq(userId.value))
            .orderBy(CALENDAR_LINKS.CREATED_AT.desc())
            .fetch()
            .withChildren()

    @Transactional(readOnly = true)
    override fun findByTokenHash(hash: TokenHash): CalendarLink? =
        dsl.selectFrom(CALENDAR_LINKS)
            .where(CALENDAR_LINKS.TOKEN_HASH.eq(hash.value))
            .fetch()
            .withChildren()
            .singleOrNull()

    /**
     * Count-then-insert made atomic per member.
     *
     * A transaction-scoped Postgres advisory lock, keyed on the member, is what makes the count
     * trustworthy: at READ COMMITTED two concurrent inserts would otherwise both read the same count
     * and both proceed, leaving a member with one more standing credential than the cap allows. The
     * lock releases when the transaction ends, whichever way it ends.
     *
     * Keyed on a hash of the user id, so a collision between two members only means they briefly
     * serialise, which costs nothing for something that runs once per deliberate click.
     */
    @Transactional
    override fun saveWithinCap(link: CalendarLink, max: Int): Boolean {
        dsl.select(DSL.field("pg_advisory_xact_lock({0}, {1})", CALENDAR_LINK_LOCK_CLASS, link.userId.value.hashCode()))
            .fetch()
        if (dsl.fetchCount(CALENDAR_LINKS, CALENDAR_LINKS.USER_ID.eq(link.userId.value)) >= max) return false

        dsl.insertInto(CALENDAR_LINKS).set(link.toRecord()).execute()
        insertChildren(link.id.value, link.options)
        return true
    }

    /**
     * Rewrites the label, the options and the child rows of the stored link, leaving its token and
     * dates as they were. The row is locked while ownership is checked, so a concurrent delete waits
     * for this update instead of leaving the child inserts pointing at a vanished link.
     */
    @Transactional
    override fun updateOwned(
        id: CalendarLinkId,
        userId: UserId,
        label: CalendarLinkLabel?,
        options: CalendarLinkOptions,
    ): CalendarLink? {
        val stored = dsl.selectFrom(CALENDAR_LINKS)
            .where(CALENDAR_LINKS.ID.eq(id.value))
            .and(CALENDAR_LINKS.USER_ID.eq(userId.value))
            .forUpdate()
            .fetchOne() ?: return null

        dsl.update(CALENDAR_LINKS)
            .set(CALENDAR_LINKS.LABEL, label?.value)
            .set(CALENDAR_LINKS.SHOW_ATTENDANCE_PREFIX, options.showAttendancePrefix)
            .set(CALENDAR_LINKS.CALENDAR_NAME_SUFFIX, options.calendarNameSuffix?.value)
            .where(CALENDAR_LINKS.ID.eq(id.value))
            .execute()
        dsl.deleteFrom(CALENDAR_LINK_ATTENDANCE_STATES).where(CALENDAR_LINK_ATTENDANCE_STATES.LINK_ID.eq(id.value)).execute()
        dsl.deleteFrom(CALENDAR_LINK_EVENT_TYPES).where(CALENDAR_LINK_EVENT_TYPES.LINK_ID.eq(id.value)).execute()
        insertChildren(id.value, options)

        return stored.toDomain(emptyList(), emptyList()).copy(label = label, options = options)
    }

    /** The child rows go with the link through their `ON DELETE CASCADE`. */
    @Transactional
    override fun deleteOwned(id: CalendarLinkId, userId: UserId): Boolean =
        dsl.deleteFrom(CALENDAR_LINKS)
            .where(CALENDAR_LINKS.ID.eq(id.value))
            .and(CALENDAR_LINKS.USER_ID.eq(userId.value))
            .execute() > 0

    /**
     * The type ids were checked against this tenant by the service, so a miss here is a type removed
     * since, which types never are (they are archived instead).
     */
    private fun insertChildren(linkId: UUID, options: CalendarLinkOptions) {
        if (options.attendanceStates.isNotEmpty()) {
            dsl.batch(
                options.attendanceStates.map { state ->
                    dsl.insertInto(CALENDAR_LINK_ATTENDANCE_STATES)
                        .set(CALENDAR_LINK_ATTENDANCE_STATES.LINK_ID, linkId)
                        .set(CALENDAR_LINK_ATTENDANCE_STATES.STATE, state.name)
                },
            ).execute()
        }
        val typeIds = options.eventTypeIds.orEmpty().map { it.value }
        if (typeIds.isNotEmpty()) {
            val inserted = dsl.insertInto(CALENDAR_LINK_EVENT_TYPES)
                .columns(CALENDAR_LINK_EVENT_TYPES.LINK_ID, CALENDAR_LINK_EVENT_TYPES.EVENT_TYPE_ID)
                .select(dsl.select(DSL.inline(linkId), EVENT_TYPES.ID).from(EVENT_TYPES).where(EVENT_TYPES.UUID.`in`(typeIds)))
                .execute()
            check(inserted == typeIds.size) { "An event type of $typeIds does not exist" }
        }
    }

    private fun List<CalendarLinksRecord>.withChildren(): List<CalendarLink> {
        if (isEmpty()) return emptyList()
        val linkIds = map { it.id }
        val statesByLink = dsl.select(CALENDAR_LINK_ATTENDANCE_STATES.LINK_ID, CALENDAR_LINK_ATTENDANCE_STATES.STATE)
            .from(CALENDAR_LINK_ATTENDANCE_STATES)
            .where(CALENDAR_LINK_ATTENDANCE_STATES.LINK_ID.`in`(linkIds))
            .fetchGroups(CALENDAR_LINK_ATTENDANCE_STATES.LINK_ID, CALENDAR_LINK_ATTENDANCE_STATES.STATE)
        val typesByLink = dsl.select(CALENDAR_LINK_EVENT_TYPES.LINK_ID, EVENT_TYPES.UUID)
            .from(CALENDAR_LINK_EVENT_TYPES)
            .join(EVENT_TYPES).on(EVENT_TYPES.ID.eq(CALENDAR_LINK_EVENT_TYPES.EVENT_TYPE_ID))
            .where(CALENDAR_LINK_EVENT_TYPES.LINK_ID.`in`(linkIds))
            .fetchGroups(CALENDAR_LINK_EVENT_TYPES.LINK_ID, EVENT_TYPES.UUID)
        return map { it.toDomain(statesByLink[it.id].orEmpty(), typesByLink[it.id].orEmpty()) }
    }

    private companion object {
        // Advisory locks are database-global, so the first key namespaces this one against any other
        // use of the mechanism. Arbitrary but fixed.
        const val CALENDAR_LINK_LOCK_CLASS = 832
    }
}

private fun CalendarLink.toRecord() = CalendarLinksRecord().also {
    it.id = id.value
    it.userId = userId.value
    it.tokenHash = tokenHash.value
    it.tokenEncrypted = encryptedToken.value
    it.label = label?.value
    it.createdAt = createdAt.atOffset(ZoneOffset.UTC)
    it.expiresAt = expiresAt.atOffset(ZoneOffset.UTC)
    it.showAttendancePrefix = options.showAttendancePrefix
    it.calendarNameSuffix = options.calendarNameSuffix?.value
}

private fun CalendarLinksRecord.toDomain(attendanceStates: List<String>, eventTypeUuids: List<UUID>) = CalendarLink(
    id = CalendarLinkId(id),
    userId = UserId(userId),
    tokenHash = TokenHash(tokenHash),
    encryptedToken = EncryptedToken(tokenEncrypted),
    label = label?.let(::CalendarLinkLabel),
    createdAt = createdAt.toInstant(),
    expiresAt = expiresAt.toInstant(),
    options = CalendarLinkOptions(
        // No rows reads as every state: the previous release, still serving while a deploy rolls
        // out, inserts links without them (ADR-0040).
        attendanceStates = attendanceStates.map(AttendanceState::valueOf).toSet()
            .ifEmpty { AttendanceState.entries.toSet() },
        // No rows is every type (ADR-0040).
        eventTypeIds = eventTypeUuids.map(::EventTypeId).toSet().takeIf { it.isNotEmpty() },
        showAttendancePrefix = showAttendancePrefix,
        calendarNameSuffix = calendarNameSuffix?.let(::CalendarNameSuffix),
    ),
)
