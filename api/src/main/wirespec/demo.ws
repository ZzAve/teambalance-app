type DemoSessionRequest {
    persona: String
}

// Guest login for the demo team (ADR-0043). persona is MEMBER (Sanne, a player) or ADMIN (Coach Kees, the team admin); anything else is 400. Exists only while teambalance.demo.enabled is on, otherwise 404. 204: a normal session for the persona was started and its tenant pinned; the client then reads /api/auth/me.
endpoint CreateDemoSession POST DemoSessionRequest /api/demo/session -> {
    204 -> Unit
    400 -> Unit
    404 -> Unit
}
