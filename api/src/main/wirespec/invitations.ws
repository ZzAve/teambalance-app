type Invitation {
    token: String,
    expiresAt: String
}

type AcceptedInvitation {
    teamId: String
}

endpoint CreateInvitation POST /api/invitations -> {
    201 -> Invitation
}

endpoint GetActiveInvitation GET /api/invitations/active -> {
    200 -> Invitation
    204 -> Unit
    403 -> Unit
}

endpoint AcceptInvitation POST /api/invitations/{token: String}/accept -> {
    200 -> AcceptedInvitation
    401 -> Unit
    404 -> Unit
}

endpoint ExpireInvitations POST /api/invitations/expire -> {
    204 -> Unit
}

endpoint RotateInvitation POST /api/invitations/rotate -> {
    201 -> Invitation
}
