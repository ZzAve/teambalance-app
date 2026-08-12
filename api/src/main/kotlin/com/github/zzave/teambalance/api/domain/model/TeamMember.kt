package com.github.zzave.teambalance.api.domain.model


data class TeamMember(
    val userId: UserId,
    // The very same [DisplayName] the user carries — the member projection reads `u.display_name`.
    val displayName: DisplayName,
    // The member's *permission* within the team — the [Role] (USER/ADMIN) held in the
    // `team_members.role` column (CHECK IN ('USER','ADMIN')). This is access level, NOT the
    // volleyball position (see [position]). The two MUST NOT be conflated (PRD #8): permission
    // governs what a member may do; position is where they play.
    val permission: Role,
    val positionId: PositionId?,
    // The label of the assigned *volleyball position* (Setter, Libero, …), resolved via a join for
    // display; null when unassigned. The very same [PositionLabel] the position itself carries — the
    // join reads `tp.label`. This is the position, NOT the permission (see [permission]).
    val position: PositionLabel?,
    // True once the member has completed the one-time onboarding flow (onboarded_at is set).
    val onboarded: Boolean,
)
