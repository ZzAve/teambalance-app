-- The Active Team is remembered per user, not per session (ADR-0023 §3): a session-only memory is
-- lost exactly when it is most useful — at a fresh magic-link login on a phone.
--
-- Nullable on purpose. NULL means "nothing remembered yet": a brand-new user, or one whose remembered
-- Team was left. Resolution never trusts this column on its own — the remembered Team is re-verified
-- against an active team_members row on every read, so a stale value degrades to "force a choice"
-- rather than to a cross-tenant read.
--
-- ON DELETE SET NULL rather than RESTRICT: a deleted Team must not pin a user's row open. Teams are
-- not deleted today, so this is a guard on a path that does not exist yet, not a workflow.
ALTER TABLE users
    ADD COLUMN last_active_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
