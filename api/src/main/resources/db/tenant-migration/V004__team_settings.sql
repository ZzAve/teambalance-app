-- Per-team settings, singleton row in each tenant schema.
-- Phase 1 of recurring events (ADR-0014): a per-team season window bounds event writes.
-- The CHECK (id = 1) plus a seeded row enforces exactly one settings row per team.

CREATE TABLE team_settings (
    id           SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    season_start DATE,
    season_end   DATE
);

-- Seed the singleton with an unconfigured season (both null => no constraint on event writes).
INSERT INTO team_settings (id) VALUES (1);
