-- Calendar links (ADR-0032): a member's personal, unauthenticated webcal subscription URL for this
-- team's events.
--
-- Tenant data, not platform data. The link exists to serve THIS team's events, its lookup runs
-- against this team's schema, and the feed it addresses is meaningless anywhere else — so the schema
-- that already scopes the events scopes the link too. That is also what makes "team A's token under
-- team B's slug" a plain miss rather than a check somebody has to remember to write: the hash is
-- looked up in B's schema, where A's row does not exist.
--
-- user_id carries no foreign key, for the same reason member_profiles.user_id does not: it names a
-- public.users row, and identity is the one genuinely platform-wide thing. Membership is re-verified
-- against public.team_members on every fetch, so a row outliving its member serves nothing.
CREATE TABLE calendar_links (
    id              UUID PRIMARY KEY,
    user_id         UUID         NOT NULL,
    -- Hex-encoded salted SHA-256 of the token: what a presented token is matched on, exactly as
    -- invitations.token is (ADR-0025). 64 hex characters.
    token_hash      VARCHAR(64)  NOT NULL UNIQUE,
    -- The same token under AES-256-GCM, so the member can be shown their link again instead of it
    -- being show-once. Read on the management path only; the feed path never decrypts.
    token_encrypted TEXT         NOT NULL,
    label           VARCHAR(50),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    -- One year after creation, with no renewal. A dead link is left in place rather than deleted: it
    -- still counts against the per-member cap, so "why can't I make a fourth?" has a visible answer.
    expires_at      TIMESTAMPTZ  NOT NULL
);

-- The management list is always "my links in this team", and the cap counts the same rows.
CREATE INDEX idx_calendar_links_user ON calendar_links (user_id);
