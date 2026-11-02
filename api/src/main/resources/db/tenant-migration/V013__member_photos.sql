-- The picture a member is shown with in this team (ADR-0038). Optional; a copy of the member's
-- Personal Photo or a separate upload. Leaving the team deletes the row.
--
-- A separate table, rather than a column on member_profiles, so the profile entity and the roster
-- queries never load image bytes; the roster only joins in `version`. No foreign key to public.users,
-- for the same reason member_profiles has none.
CREATE TABLE member_photos (
    user_id    UUID        PRIMARY KEY,
    image      BYTEA       NOT NULL,
    version    TEXT        NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
