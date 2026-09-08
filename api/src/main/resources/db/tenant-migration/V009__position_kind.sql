-- A position is played or staffed (#281). A headcount target is a target for PLAYERS: an admin
-- asking for 12 at a training means twelve on the court, so an attending coach must not fill one of
-- those twelve. Before this column there was nothing to tell Trainer from Setter, and an event a
-- player short reported itself Full.
--
-- The default is deliberately PLAYING: every position that exists today keeps counting exactly as it
-- did, so no team's numbers move on deploy. Labels are not sniffed for "Trainer"/"Coach" — a team
-- that means it says so, once, in the position editor.
ALTER TABLE positions
    ADD COLUMN kind VARCHAR(16) NOT NULL DEFAULT 'PLAYING';

ALTER TABLE positions
    ADD CONSTRAINT positions_kind_known CHECK (kind IN ('PLAYING', 'STAFF'));
