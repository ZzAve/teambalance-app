package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant
import java.util.UUID

/**
 * The identity of an [ActAs] episode. Same shape and the same edges-only conversion as [EventId],
 * which documents the pattern.
 */
@JvmInline
value class ActAsId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        fun random() = ActAsId(UUID.randomUUID())
    }
}

/** How a team-visible record renders its actor: generically, never by name (ADR-0024 §4). */
enum class ActorKind {
    MEMBER,
    PLATFORM_ADMIN,
}

/**
 * **Act-as** (ADR-0024): the explicitly entered, time-boxed state in which a **Platform Admin**
 * operates inside one Team as if they were an Admin of it. It is a mode you enter, never a property
 * you carry — [ACT_AS_TTL] is what keeps that true, and it is re-checked on every request.
 *
 * The same value is the grant and the **Act-as Record**: [exitedAt] distinguishes an episode that was
 * ended deliberately from one that simply ran out.
 */
data class ActAs(
    val id: ActAsId,
    val teamId: TeamId,
    /** The real user behind the grant — kept for forensics, never rendered to the team. */
    val userId: UserId,
    val actorKind: ActorKind,
    val enteredAt: Instant,
    val lastActiveAt: Instant,
    val expiresAt: Instant,
    val exitedAt: Instant?,
) {
    /**
     * Whether this grant still authorizes anything at [now]. An exited grant is done; an open one is
     * done the moment [expiresAt] passes. Fail-safe either way: a Platform Admin is structurally
     * teamless (ADR-0024 §3), so there is no membership to silently fall back to.
     */
    fun isActiveAt(now: Instant): Boolean = exitedAt == null && expiresAt.isAfter(now)

    /** Slides the box forward from [now] — the grant renews on activity, not on the wall clock. */
    fun slidTo(now: Instant): ActAs = copy(lastActiveAt = now, expiresAt = now.plus(ACT_AS_TTL))

    companion object {
        /**
         * Sixty minutes, sliding on activity (ADR-0024 §4). Sessions themselves last four weeks
         * (ADR-0015) precisely so nobody thinks about them; act-as riding that unchanged would mean
         * "I popped into Dames 5 on Tuesday" is still true on Friday.
         */
        val ACT_AS_TTL: Duration = Duration.ofMinutes(60)

        /** Opens a grant for [userId] on [teamId] at [now]. The only way an [ActAs] comes into being. */
        fun enter(userId: UserId, teamId: TeamId, now: Instant) = ActAs(
            id = ActAsId.random(),
            teamId = teamId,
            userId = userId,
            actorKind = ActorKind.PLATFORM_ADMIN,
            enteredAt = now,
            lastActiveAt = now,
            expiresAt = now.plus(ACT_AS_TTL),
            exitedAt = null,
        )
    }
}
