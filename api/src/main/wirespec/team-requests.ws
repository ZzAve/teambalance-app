enum TeamRequestStatus {
    PENDING,
    APPROVED,
    REJECTED
}

// A request for a team (ADR-0047). Timestamps are ISO-8601 instants. `creationCode` is set only while the request is APPROVED and its code can still be used (unconsumed, unexpired): an APPROVED request without a code has been used or has lapsed, and the requester may ask again. `rejectReason` is set only on a REJECTED request, and only if the admin gave one.
type TeamRequest {
    id: String,
    teamName: String,
    purpose: String,
    status: TeamRequestStatus,
    requesterEmail: String,
    requestedAt: String,
    decidedAt: String?,
    rejectReason: String?,
    creationCode: String?
}

type TeamRequestList {
    requests: TeamRequest[]
}

type SubmitTeamRequestBody {
    teamName: String,
    purpose: String
}

type RejectTeamRequestBody {
    reason: String?
}

// Any signed-in user. 400 for a blank or over-long team name (code INVALID_NAME) or a blank or over-long purpose (INVALID_PURPOSE). 409 when the caller already has a pending request.
endpoint SubmitTeamRequest POST SubmitTeamRequestBody /api/team-requests -> {
    201 -> TeamRequest
    400 -> Unit
    409 -> Unit
}

// The caller's latest request, whatever its status. 404 when they never made one.
endpoint GetMyTeamRequest GET /api/team-requests/mine -> {
    200 -> TeamRequest
    404 -> Unit
}

// Platform Admins only. Every pending request (oldest first), then the 20 most recently decided ones.
endpoint ListTeamRequests GET /api/admin/team-requests -> {
    200 -> TeamRequestList
    403 -> Unit
}

// Mints a creation code that expires in 30 days, links it to the request and mails it to the requester. 409 when the request is not pending.
endpoint ApproveTeamRequest POST /api/admin/team-requests/{id: String}/approve -> {
    200 -> TeamRequest
    403 -> Unit
    404 -> Unit
    409 -> Unit
}

// `reason` is optional, at most 500 characters (400 over that), and goes in the mail to the requester. 409 when the request is not pending.
endpoint RejectTeamRequest POST RejectTeamRequestBody /api/admin/team-requests/{id: String}/reject -> {
    200 -> TeamRequest
    400 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}
