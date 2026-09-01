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

// The team's current unspent ADMIN handover link, so it survives a page refresh instead of being lost to local state - the same recoverability the shareable USER link got in ADR-0025, now for the handover link. 204 when there is none (a normal state the UI turns into a "create one" offer). Admin-only.
endpoint GetActiveAdminInvitation GET /api/invitations/admin/active -> {
    200 -> Invitation
    204 -> Unit
    403 -> Unit
}

// Revoke-and-reissue for the ADMIN handover link: expires the active one and mints a fresh replacement in a single step (in case the link leaked before it reached the right person). Role-scoped, so the shareable USER link is untouched. Admin-only.
endpoint RotateAdminInvitation POST /api/invitations/admin/rotate -> {
    201 -> Invitation
    403 -> Unit
}

// Revokes the team's active ADMIN handover link without a replacement. Role-scoped, so the shareable USER link keeps working. Admin-only.
endpoint ExpireAdminInvitations POST /api/invitations/admin/expire -> {
    204 -> Unit
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
