endpoint HealthCheck GET /api/health -> {
    200 -> HealthStatus
}

type HealthStatus {
    status: String
}
