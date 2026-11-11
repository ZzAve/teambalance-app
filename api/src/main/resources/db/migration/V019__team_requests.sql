-- A signed-in user asks for a team; a Platform Admin approves (minting a creation code) or rejects (ADR-0047).
-- The creation code stays the only gate to a tenant schema: this table only records who asked and the decision.
CREATE TABLE team_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_name           VARCHAR(100) NOT NULL,
    purpose             TEXT         NOT NULL,
    status              VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
    reject_reason       VARCHAR(500),
    requested_at        TIMESTAMPTZ  NOT NULL,
    decided_at          TIMESTAMPTZ,
    decided_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    creation_code_id    UUID REFERENCES team_creation_codes(id) ON DELETE SET NULL,
    CONSTRAINT team_requests_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT team_requests_team_name_check CHECK (char_length(team_name) BETWEEN 1 AND 100),
    CONSTRAINT team_requests_purpose_check CHECK (char_length(purpose) BETWEEN 1 AND 1000),
    CONSTRAINT team_requests_reject_reason_check CHECK (char_length(reject_reason) BETWEEN 1 AND 500)
);
-- One pending request per user: a second submit while one is open is a 409.
CREATE UNIQUE INDEX team_requests_one_pending_per_user ON team_requests (user_id) WHERE status = 'PENDING';
CREATE INDEX team_requests_user_requested_idx ON team_requests (user_id, requested_at DESC);
