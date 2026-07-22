type Member {
    userId: String,
    displayName: String,
    role: String,
    position: Position?,
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
