-- Platform schema: shared across all tenants
-- Tenant-specific data lives in per-team schemas (created dynamically)

CREATE TABLE teams (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    sport         VARCHAR(50)  NOT NULL,
    schema_name   VARCHAR(100) NOT NULL UNIQUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    display_name  VARCHAR(100) NOT NULL,
    avatar_url    VARCHAR(500),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       UUID         NOT NULL REFERENCES teams(id),
    user_id       UUID         NOT NULL REFERENCES users(id),
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    team_role     VARCHAR(50),
    active        BOOLEAN      NOT NULL DEFAULT true,
    joined_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE(team_id, user_id),
    CONSTRAINT valid_role CHECK (role IN ('USER', 'ADMIN'))
);

CREATE TABLE invitations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       UUID         NOT NULL REFERENCES teams(id),
    token         VARCHAR(100) NOT NULL UNIQUE,
    created_by    UUID         NOT NULL REFERENCES users(id),
    expires_at    TIMESTAMPTZ  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_team  ON invitations(team_id);
