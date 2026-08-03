package com.github.zzave.teambalance.api.domain.model


data class TeamMember(
    val userId: UserId,
    val displayName: String,
    val role: String,
    val positionId: PositionId?,
    // The label of the assigned position, resolved via a join for display; null when unassigned.
    val position: String?,
    // True once the member has completed the one-time onboarding flow (onboarded_at is set).
    val onboarded: Boolean,
)
