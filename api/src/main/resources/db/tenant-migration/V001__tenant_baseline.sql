-- Tenant schema: one copy per team
-- Run by TenantSchemaManager when a team is provisioned

CREATE TABLE event_types (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    color         VARCHAR(7),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type_id   UUID          NOT NULL REFERENCES event_types(id),
    title           VARCHAR(200)  NOT NULL,
    description     TEXT,
    start_time      TIMESTAMPTZ   NOT NULL,
    end_time        TIMESTAMPTZ,
    location        VARCHAR(500),
    recurring_group UUID,
    created_by      UUID          NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE attendances (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL,
    state       VARCHAR(20) NOT NULL DEFAULT 'NOT_RESPONDED',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(event_id, user_id),
    CONSTRAINT valid_state CHECK (state IN ('ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'))
);

CREATE TABLE event_audience (
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(255),
    amount_cents    INTEGER      NOT NULL,
    counterparty    VARCHAR(200) NOT NULL,
    description     VARCHAR(500),
    timestamp       TIMESTAMPTZ  NOT NULL,
    excluded        BOOLEAN      NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type ON events(event_type_id);
CREATE INDEX idx_attendances_event ON attendances(event_id);
CREATE INDEX idx_attendances_user ON attendances(user_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
