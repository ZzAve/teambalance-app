-- Calendar link event-type filter (ADR-0040): the feed carries only events of the listed types.
--
-- No rows for a link means every type, including types created after the link, so every existing
-- link keeps serving what it did and nothing needs backfilling. Types are only ever archived, never
-- deleted, so the type side has no cascade: a delete that reached here would be a bug to refuse.
CREATE TABLE calendar_link_event_types (
    link_id       UUID   NOT NULL REFERENCES calendar_links (id) ON DELETE CASCADE,
    event_type_id BIGINT NOT NULL REFERENCES event_types (id),
    PRIMARY KEY (link_id, event_type_id)
);
