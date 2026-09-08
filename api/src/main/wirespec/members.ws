// A member's position as a reference: enough to display it and to preselect the picker, and nothing more. Not the vocabulary entry Position — a member row resolves the label by join and has never known the position's kind (#281), so carrying the full type here would have meant reporting a kind nobody looked up.
type MemberPosition {
    id: String,
    label: String
}

type Member {
    userId: String,
    displayName: String,
    role: String,
    position: MemberPosition?,
    onboarded: Boolean
}

type UpdateMemberRequest {
    displayName: String,
    role: String,
    positionId: String?
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

endpoint CompleteOnboarding PUT UpdateMemberRequest /api/members/me/onboarding -> {
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
