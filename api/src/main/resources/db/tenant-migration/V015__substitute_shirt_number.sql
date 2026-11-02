-- The number a Substitute plays under, kept on the Substitute list (ADR-0038). Optional; unique among
-- Substitutes only, which SubstituteService checks (NUMBER_TAKEN) as MemberService does for Members.
-- It may equal a Member's: a Substitute often wears a borrowed shirt.
ALTER TABLE substitutes
    ADD COLUMN shirt_number SMALLINT NULL CHECK (shirt_number BETWEEN 0 AND 999);
