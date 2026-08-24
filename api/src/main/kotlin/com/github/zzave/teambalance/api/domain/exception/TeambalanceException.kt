package com.github.zzave.teambalance.api.domain.exception

import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import java.util.UUID

sealed class TeambalanceException(message: String) : RuntimeException(message)

// `code` is the stable machine-readable discriminator for 400 rejections the frontend must place
// against a specific field (slug vs name). Mirrors the code convention of ForbiddenException/
// ConflictException; the generic 400 handlers (plain TeambalanceException / IllegalArgumentException)
// stay codeless.
sealed class BadRequestException(message: String, val code: String) : TeambalanceException(message)

// Blank or too-long team name → 400 INVALID_NAME (placed on the name field).
class InvalidTeamNameException(message: String) : BadRequestException(message, "INVALID_NAME")

// A user-supplied slug that fails the format (`^[a-z0-9]+(-[a-z0-9]+)*$`) or the ≤58-char length cap
// (which keeps `team_` + slug within Postgres' 63-byte identifier limit) → 400 INVALID_SLUG. The slug
// is validated, not derived (#158): the caller owns the address, so a bad one is their error to fix.
class InvalidSlugException(message: String) : BadRequestException(message, "INVALID_SLUG")

sealed class NotFoundException(message: String) : TeambalanceException(message)

class EventNotFoundException(id: EventId) : NotFoundException("Event not found: $id")

class EventTypeNotFoundException(id: EventTypeId) : NotFoundException("EventType not found: $id")

class AttendanceNotFoundException(eventId: EventId, userId: UserId) :
    NotFoundException("Attendance not found for event $eventId and user $userId")

class MemberNotFoundException(userId: UserId) : NotFoundException("Member not found: $userId")

class PositionNotFoundException(id: PositionId) : NotFoundException("Position not found: $id")

// The codes-admin CRUD (#154 Slice 4) targets a code that does not exist → 404. Distinct from the
// opaque INVALID_CREATION_CODE 403 the redeem path returns: this is an authenticated platform admin
// managing codes, not a founder probing them, so a plain not-found is appropriate.
class CreationCodeNotFoundException(code: String) : NotFoundException("Creation code not found: $code")

// Act-as was asked to enter a team that does not exist (ADR-0024). A plain 404: the caller is an
// authenticated platform admin who already sees every team in the console, so there is nothing to
// keep opaque here — unlike the member-facing activate path, where "not yours" and "no such team"
// must be indistinguishable.
class TeamNotFoundException(teamId: TeamId) : NotFoundException("Team not found: $teamId")

// `code` is a stable machine-readable discriminator (the message is human prose) so clients can tell
// the forbidden reasons apart — e.g. "no team yet" (send to login/onboarding) vs "not an admin".
sealed class ForbiddenException(message: String, val code: String) : TeambalanceException(message)

class NotTeamAdminException(userId: UserId, teamId: TeamId) :
    ForbiddenException("User $userId is not an admin of team $teamId", "NOT_TEAM_ADMIN")

// Opaque by design: a creation code that is unknown, already consumed, or expired all surface the same
// 403 with the same code/message, so a caller can't enumerate which codes exist or probe their state.
class InvalidCreationCodeException :
    ForbiddenException("Invalid creation code", "INVALID_CREATION_CODE")

class NoTeamMembershipException(userId: UserId) :
    ForbiddenException("User $userId has no active team membership", "NO_TEAM_MEMBERSHIP")

// Caller is not on the platform-admin allowlist (teambalance.platform-admins). Fail-closed: the empty
// default forbids everyone. Gates the platform-admin surface (creation-codes CRUD, #154 Slice 4).
class NotPlatformAdminException(userId: UUID) :
    ForbiddenException("User $userId is not a platform admin", "NOT_PLATFORM_ADMIN")

// The caller entered Act-as (ADR-0024) and the 60-minute box ran out. Deliberately NOT a generic 403:
// "your act-as ran out" and "you may not do this" call for different things from the frontend — the
// first returns the Platform Admin to the console, the second is an error to read. A lapse is
// fail-safe rather than fail-dangerous: a Platform Admin is structurally teamless (ADR-0024 §3), so
// there is no membership to silently fall back into and the request resolves to no tenant at all.
class ActAsExpiredException(userId: UserId) :
    ForbiddenException("Act-as for user $userId has expired", "ACT_AS_EXPIRED")

class CannotChangeOwnRoleException(userId: UserId) :
    ForbiddenException("User $userId cannot elevate their own role", "CANNOT_SELF_PROMOTE")

// `code` is the stable machine-readable discriminator for 422 rejections — a request that is
// well-formed but violates a business rule (not a state clash, so not a 409). Mirrors the code
// convention of ForbiddenException/ConflictException.
sealed class UnprocessableEntityException(message: String, val code: String) : TeambalanceException(message)

class EventOutsideSeasonException(start: java.time.LocalDate) :
    UnprocessableEntityException("Event start $start falls outside the configured season", "EVENT_OUTSIDE_SEASON")

class RecurrenceExceedsCapException(cap: Int) :
    UnprocessableEntityException(
        "Recurring series exceeds the cap of $cap events — shorten the range or thin the schedule",
        "RECURRENCE_EXCEEDS_CAP",
    )

class EmptyRecurrenceException :
    UnprocessableEntityException(
        "Recurring series generated no dates — pick at least one weekday that falls inside the range",
        "EMPTY_RECURRENCE",
    )

// `code` is the stable machine-readable discriminator for 409 conflicts (state clashes clients can act on),
// mirroring ForbiddenException — e.g. "display name already used" vs "would remove the last admin".
sealed class ConflictException(message: String, val code: String) : TeambalanceException(message)

class NameTakenException(name: String) :
    ConflictException("Display name '$name' is already taken in this team", "NAME_TAKEN")

class LastAdminException(teamId: TeamId) :
    ConflictException("Team $teamId must keep at least one admin", "LAST_ADMIN")

class PositionLabelTakenException(label: String) :
    ConflictException("Position '$label' already exists in this team", "POSITION_LABEL_TAKEN")

// A team with this slug (and therefore this derived schema) already exists. No auto-suffixing — the
// caller picks a different name.
class TeamSlugTakenException(slug: String) :
    ConflictException("A team with slug '$slug' already exists", "TEAM_SLUG_TAKEN")

// Revoking (deleting) a code that has already been consumed is refused: a consumed code is the audit
// record of a real team's creation, not a pending invite to withdraw. The admin can't un-consume it.
class CreationCodeConsumedException(code: String) :
    ConflictException("Creation code '$code' has already been consumed", "CREATION_CODE_CONSUMED")
