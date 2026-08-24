-- Roster fill (#219): per-event-type position/headcount targets, overridable per event.
--
-- Two axes, independent of each other: a total headcount and a per-position lineup. `track_roster`
-- is an explicit flag rather than "no targets means off", because "tracking on with no hard
-- requirement" (a training tally) is a real state, distinct from "not a roster event" (a social).
--
-- position_id is a real foreign key: positions became tenant rows in V007 (ADR-0026), so the target
-- and the position it names now live in the same schema.
--
-- That is worth stating because it was very nearly not so. While positions sat in the platform
-- schema no FK could span the boundary, and referential integrity had to be assembled from three
-- application-side pieces — a write-time check that the id was the team's, a delete-time clear of
-- every target, and a read-time join against the live vocabulary to hide anything that slipped
-- between the two writes. ON DELETE CASCADE replaces all three, atomically and without a window.

ALTER TABLE event_types
    ADD COLUMN archived     BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN track_roster BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN total_target INTEGER,
    ADD CONSTRAINT event_types_total_target_positive
        CHECK (total_target IS NULL OR total_target BETWEEN 1 AND 200);

CREATE TABLE event_type_position_targets (
    event_type_id BIGINT  NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
    position_id   UUID    NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    target_count  INTEGER NOT NULL CHECK (target_count BETWEEN 1 AND 99),
    PRIMARY KEY (event_type_id, position_id)
);

-- An event's override is present iff roster_track_roster IS NOT NULL: `track_roster` is non-null in
-- the value object, so its nullability here carries the "override or inherit" bit with no separate
-- flag column that could disagree with the rest of the row.
ALTER TABLE events
    ADD COLUMN roster_track_roster BOOLEAN,
    ADD COLUMN roster_total_target INTEGER,
    ADD CONSTRAINT events_roster_total_target_positive
        CHECK (roster_total_target IS NULL OR roster_total_target BETWEEN 1 AND 200),
    ADD CONSTRAINT events_roster_override_consistent
        CHECK (roster_track_roster IS NOT NULL OR roster_total_target IS NULL);

CREATE TABLE event_position_targets (
    event_id     BIGINT  NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    position_id  UUID    NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    target_count INTEGER NOT NULL CHECK (target_count BETWEEN 1 AND 99),
    PRIMARY KEY (event_id, position_id)
);

-- The listing joins targets by position id to clear them when a position is deleted; the PKs above
-- already index (parent, position), so only the position-first lookup needs its own index.
CREATE INDEX idx_event_type_position_targets_position ON event_type_position_targets(position_id);
CREATE INDEX idx_event_position_targets_position ON event_position_targets(position_id);
