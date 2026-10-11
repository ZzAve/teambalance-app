-- Money pool (ADR-0042): a per-team switch (on by default) and the team's Bunq connection.
-- Both are singletons per tenant schema, pinned by CHECK (id = 1) like team_settings.
-- No connection row means the team has not connected Bunq.

CREATE TABLE money_pool_settings (
    id      SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    enabled BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO money_pool_settings (id) VALUES (1);

CREATE TABLE bunq_connection (
    id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    bunq_account_id TEXT        NOT NULL,
    connected_at    TIMESTAMPTZ NOT NULL
);
