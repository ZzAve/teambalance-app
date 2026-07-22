type Member {
    userId: String,
    displayName: String,
    role: String
}

type UpdateMemberRequest {
    displayName: String,
    role: String
}

endpoint GetCurrentMember GET /api/members/me -> {
    200 -> Member
    401 -> Unit
}

endpoint UpdateMember PUT UpdateMemberRequest /api/members/{userId: String} -> {
    200 -> Member
    403 -> Unit
    404 -> Unit
    409 -> Unit
}
