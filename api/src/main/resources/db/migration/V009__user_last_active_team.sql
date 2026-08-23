-- Remembered per user, not per session (ADR-0023 §3): a session-only memory is lost exactly when it
-- is most useful, at a fresh magic-link login on a phone.
--
-- NULL means "nothing remembered yet". Resolution re-verifies this against an active team_members row
-- on every read, so a stale value degrades to "force a choice" rather than a cross-tenant read.
ALTER TABLE users
    ADD COLUMN last_active_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
