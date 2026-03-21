-- Tenant schema: one copy per team
-- Run by TenantSchemaManager when a team is provisioned

CREATE TABLE event_types (
    id            BIGSERIAL PRIMARY KEY,
    uuid          UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name          VARCHAR(100) NOT NULL,
    color         VARCHAR(7),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE events (
    id              BIGSERIAL PRIMARY KEY,
    uuid            UUID          NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    event_type_id   BIGINT        NOT NULL REFERENCES event_types(id),
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
    id          BIGSERIAL PRIMARY KEY,
    uuid        UUID        NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    event_id    BIGINT      NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL,
    state       VARCHAR(20) NOT NULL DEFAULT 'NOT_RESPONDED',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(event_id, user_id),
    CONSTRAINT valid_state CHECK (state IN ('ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'))
);

CREATE TABLE event_audience (
    event_id    BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    uuid            UUID         NOT NULL DEFAULT gen_random_uuid() UNIQUE,
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
CREATE INDEX idx_events_uuid ON events(uuid);
CREATE INDEX idx_attendances_event ON attendances(event_id);
CREATE INDEX idx_attendances_user ON attendances(user_id);
CREATE INDEX idx_attendances_uuid ON attendances(uuid);
CREATE INDEX idx_event_types_uuid ON event_types(uuid);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
