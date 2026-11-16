-- A pinned Bulletin Board Post comes first on the board and shows in the strip on every page (ADR-0048).
ALTER TABLE bulletin_posts ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT FALSE;
