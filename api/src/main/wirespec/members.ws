// A member's position as a reference: enough to display it and to preselect the picker, and nothing more. Not the vocabulary entry Position — a member row resolves the label by join and has never known the position's kind (#281), so carrying the full type here would have meant reporting a kind nobody looked up.
type MemberPosition {
    id: String,
    label: String
}

// `photoVersion` changes whenever the Team Photo does; null means none, shown by initials (ADR-0038). The image itself is binary, so it is served outside this contract at GET /api/members/{userId}/photo, with this value as `?v=` so a cached image is never stale.
type Member {
    userId: String,
    displayName: String,
    role: String,
    position: MemberPosition?,
    onboarded: Boolean,
    shirtNumber: Integer?,
    photoVersion: String?
}

// The member's full editable state: a missing or null `shirtNumber` clears it. Known risk, accepted: an app from before shirt numbers never sends it, so a save from one clears the number (PR #383). 409 NUMBER_TAKEN when another current member wears that number; 400 outside 0..999 (ADR-0038).
type UpdateMemberRequest {
    displayName: String,
    role: String,
    positionId: String?,
    shirtNumber: Integer?
}

// Onboarding sets name, position and, when given, the Shirt Number; a missing or null `shirtNumber` keeps the current one, so an app from before this field never clears a number an Admin set. 409 NUMBER_TAKEN as on UpdateMember. `role` is ignored, kept so the body stays what earlier apps send.
type CompleteOnboardingRequest {
    displayName: String,
    role: String,
    positionId: String?,
    shirtNumber: Integer?
}

type MemberList {
    members: Member[]
}

endpoint GetCurrentMember GET /api/members/me -> {
    200 -> Member
    401 -> Unit
}

endpoint ListMembers GET /api/members -> {
    200 -> MemberList
    403 -> Unit
}

endpoint UpdateMember PUT UpdateMemberRequest /api/members/{userId: String} -> {
    200 -> Member
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

endpoint CompleteOnboarding PUT CompleteOnboardingRequest /api/members/me/onboarding -> {
    200 -> Member
    401 -> Unit
    409 -> Unit
}

endpoint RemoveMember DELETE /api/members/{userId: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}
