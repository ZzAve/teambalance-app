-- Act-as (ADR-0024 §1): the explicitly entered, time-boxed state in which a Platform Admin operates
-- inside a Team they are not a Member of. Deliberately ONE table for two jobs, because they describe
-- the same episode: the grant the server re-checks on every request, and the Act-as Record the team
-- can read afterwards. A second table would let the two disagree about what happened.
--
-- Platform schema, not tenant: the grant is checked before any tenant is resolved (that is the point
-- — it is what resolves one), so it has to be readable with no search_path set.
--
-- No team_members row is ever written for this (ADR-0024 §2): the Virtual Member is synthesized at
-- the authorization chokepoint and exists only for the duration of a request.
CREATE TABLE act_as_sessions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id        UUID        NOT NULL REFERENCES teams (id),
    -- The REAL user id underneath, kept for forensics. Never disguised as the team's own admin and
    -- never collapsed to a synthetic system user while a real human is behind it (ADR-0024 §4).
    created_by     UUID        NOT NULL REFERENCES users (id),
    -- How the team-visible surface renders the actor: generically, so no operator email is exposed.
    -- Only PLATFORM_ADMIN is written today; MEMBER exists so act-as records fold into the general
    -- audit log (#237) as one action_type without a column migration.
    actor_kind     TEXT        NOT NULL CHECK (actor_kind IN ('MEMBER', 'PLATFORM_ADMIN')),
    entered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Slid forward on every request the grant serves; also the honest end of the visible window for
    -- a grant that lapsed rather than being exited.
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- The 60-minute box (ADR-0024 §4). Checked on EVERY request, independently of the session's
    -- memoized tenant routing — that memo is never re-verified, so a grant that rode it alone would
    -- never expire and act-as would become the standing property ADR-0024 §2 forbids.
    expires_at     TIMESTAMPTZ NOT NULL,
    -- NULL while the grant is open. An open row whose expires_at has passed is precisely "entered and
    -- lapsed" — the state that answers ACT_AS_EXPIRED rather than a generic 403.
    exited_at      TIMESTAMPTZ
);

-- One open grant per Platform Admin: entering a second Team closes the first, so "which Team am I in"
-- always has exactly one answer, and the banner can never name the wrong one.
CREATE UNIQUE INDEX act_as_sessions_one_open_per_user
    ON act_as_sessions (created_by)
    WHERE exited_at IS NULL;

-- The team-visible read: this Team's episodes, newest first.
CREATE INDEX act_as_sessions_by_team ON act_as_sessions (team_id, entered_at DESC);
