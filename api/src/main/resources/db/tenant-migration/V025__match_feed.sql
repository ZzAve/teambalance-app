-- The team's Nevobo match feed (ADR-0047): one row at most. last_checked_at is written when a check starts,
-- so two instances do not both run it; last_check_failed tells the admin the stored matches may be old.
CREATE TABLE match_feed (
    id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    feed_url          TEXT        NOT NULL,
    team_name         TEXT        NOT NULL,
    last_checked_at   TIMESTAMPTZ NULL,
    last_check_failed BOOLEAN     NOT NULL DEFAULT FALSE
);

-- The matches the last successful check read from the feed, all teams of the poule. Replaced as a whole on
-- each successful check. Findings are not stored: they are computed against the events when read.
CREATE TABLE match_feed_matches (
    code       TEXT PRIMARY KEY,
    link       TEXT        NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    home_team  TEXT        NOT NULL,
    away_team  TEXT        NOT NULL,
    venue      TEXT        NULL
);
