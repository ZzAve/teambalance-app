-- A Substitute's name is unique on the Team's list, ignoring case (#359): the picker and the
-- settings list tell Substitutes apart by name. SubstituteService checks it first to answer 409;
-- this index refuses the second of two concurrent creates, as uq_positions_label does for Positions.
CREATE UNIQUE INDEX uq_substitutes_name ON substitutes (lower(name));
