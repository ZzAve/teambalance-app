-- References on events (ADR-0016): a labeled, outbound URL an admin curates on an Event
-- (Nevobo match page, digital match form). Stored structured rather than as rich text in the
-- description, so rendering is a plain anchor with no HTML-injection surface.
--
-- Child table, ordered by `position`, cascading off events exactly like `attendances`. The
-- app enforces http/https-only and the <=10 cap; the DB enforces shape, lengths, and cleanup.

CREATE TABLE event_references (
    id        BIGSERIAL     PRIMARY KEY,
    event_id  BIGINT        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    position  INT           NOT NULL,
    title     VARCHAR(100),
    url       VARCHAR(2048) NOT NULL,
    UNIQUE (event_id, position)
);

CREATE INDEX idx_event_references_event_id ON event_references(event_id);
