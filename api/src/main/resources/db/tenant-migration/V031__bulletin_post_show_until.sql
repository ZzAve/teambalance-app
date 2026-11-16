-- After show_until a Bulletin Board Post is no longer shown to Members; Admins still see it (ADR-0048).
ALTER TABLE bulletin_posts ADD COLUMN show_until TIMESTAMPTZ NULL;
