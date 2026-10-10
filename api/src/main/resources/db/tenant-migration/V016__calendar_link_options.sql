-- Calendar link options (ADR-0040): which of the subscriber's own answers the feed includes, whether
-- titles wear the answer prefix, and an optional suffix on the calendar's name.
--
-- Every existing link is given the "Me" shape — all four states, prefix on, no suffix — which is
-- exactly what it served before, so every subscribed feed stays byte-identical.
ALTER TABLE calendar_links
    ADD COLUMN show_attendance_prefix BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN calendar_name_suffix   VARCHAR(30);

-- A join table rather than an array or jsonb column, which the schema uses nowhere else; it is the
-- same shape as event_type_position_targets. Never empty for a link (the domain requires one state).
CREATE TABLE calendar_link_attendance_states (
    link_id UUID        NOT NULL REFERENCES calendar_links (id) ON DELETE CASCADE,
    state   VARCHAR(16) NOT NULL,
    PRIMARY KEY (link_id, state)
);

INSERT INTO calendar_link_attendance_states (link_id, state)
SELECT l.id, s.state
FROM   calendar_links l
CROSS JOIN (VALUES ('ATTENDING'), ('MAYBE'), ('ABSENT'), ('NOT_RESPONDED')) AS s (state);
