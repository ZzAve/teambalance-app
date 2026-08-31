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

// The single-use, ADMIN-granting handover link (ADR-0024 section 5). Distinct from CreateInvitation, whose link grants USER and stays "one link, many joiners" (ADR-0025): an ADMIN grant with those semantics would hand admin to everyone the recipient forwards it to, so it is spent on first accept. Idempotent while unconsumed - a team accumulates at most one live ADMIN credential, mirroring ADR-0025's anti-accumulation rule - and mints a fresh one once the previous was accepted or expired. Admin-only (the acting-in Platform Admin's Virtual Member is ADMIN).
endpoint CreateAdminInvitation POST /api/invitations/admin -> {
    201 -> Invitation
    403 -> Unit
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
