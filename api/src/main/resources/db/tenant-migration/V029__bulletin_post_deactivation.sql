-- An Admin's delete hides a Bulletin Board Post and keeps it 14 days for a restore (ADR-0048).
-- A scheduled job removes the row, and with it its edits, after that.
ALTER TABLE bulletin_posts ADD COLUMN deactivated_at TIMESTAMPTZ NULL;
