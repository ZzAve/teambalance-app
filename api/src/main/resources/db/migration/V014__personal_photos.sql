-- A person's own picture, independent of any Team (ADR-0038). Only its owner ever sees it; a Team
-- Photo is a byte copy taken from it, never a reference to it.
--
-- Auto-pinned to `public` by spring.flyway.schemas (application.yml). A separate table, rather than a
-- column on users, so reading a user never loads the image bytes.
CREATE TABLE personal_photos (
    user_id    UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    image      BYTEA       NOT NULL,
    version    TEXT        NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
