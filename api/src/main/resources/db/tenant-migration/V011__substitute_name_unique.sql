-- A Substitute's name is unique on the Team's list, ignoring case (#359): the picker and the
-- settings list tell Substitutes apart by name. SubstituteService checks it first to answer 409;
-- this index refuses the second of two concurrent creates, as uq_positions_label does for Positions.
--
-- Slices 1 and 2 accepted any name, so a Team may already hold "Jan" twice. The oldest keeps the
-- name; each later one gets " (2)", " (3)", … so the index can be created and an Admin can rename
-- them from team settings. left(…, 95) keeps the result within the column's 100 characters.
WITH ranked AS (
    SELECT id, row_number() OVER (PARTITION BY lower(name) ORDER BY created_at, id) AS n
    FROM   substitutes
)
UPDATE substitutes s
SET    name = left(s.name, 95) || ' (' || r.n || ')'
FROM   ranked r
WHERE  r.id = s.id
AND    r.n > 1;

CREATE UNIQUE INDEX uq_substitutes_name ON substitutes (lower(name));
