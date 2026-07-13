type Invitation {
    token: String,
    expiresAt: String
}

endpoint CreateInvitation POST /api/invitations -> {
    201 -> Invitation
}
