-- Bunq OAuth `state` (ADR-0042): the single-use credential that ties the browser's return from Bunq
-- back to the Admin and Team that started the connection. Platform-wide because the callback request
-- has no tenant yet. Only the SHA-256 of the state is stored, like magic_link_tokens.

CREATE TABLE bunq_oauth_states (
    id            UUID PRIMARY KEY,
    state_hash    VARCHAR(64) NOT NULL UNIQUE,
    team_id       UUID        NOT NULL REFERENCES teams (id),
    admin_user_id UUID        NOT NULL REFERENCES users (id),
    expires_at    TIMESTAMPTZ NOT NULL,
    used_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
