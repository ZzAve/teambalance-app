-- Platform-level one-time codes that gate self-service team creation (issue #154, ADR-0019).
-- A code is redeemable while consumed_at IS NULL and (expires_at IS NULL OR expires_at > now());
-- create-team consumes it atomically (single conditional UPDATE) so a code can be spent at most once.
CREATE TABLE team_creation_codes (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                 VARCHAR(100) NOT NULL UNIQUE,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    -- NULL = never expires; otherwise the code stops being redeemable once now() passes it.
    expires_at           TIMESTAMPTZ,
    -- NULL until spent; stamped together with consumed_by_user_id in the same atomic UPDATE.
    consumed_at          TIMESTAMPTZ,
    consumed_by_user_id  UUID REFERENCES users(id)
);
