type CreationCode {
    code: String,
    createdAt: String,
    expiresAt: String?,
    consumedAt: String?,
    consumedByUserId: String?,
    createdTeamId: String?
}

type CreationCodeList {
    codes: CreationCode[]
}

type CreateCreationCodeRequest {
    expiresAt: String?
}

endpoint ListCreationCodes GET /api/admin/creation-codes -> {
    200 -> CreationCodeList
    403 -> Unit
}

endpoint CreateCreationCode POST CreateCreationCodeRequest /api/admin/creation-codes -> {
    201 -> CreationCode
    403 -> Unit
}

endpoint RevokeCreationCode DELETE /api/admin/creation-codes/{code: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
    409 -> Unit
}
