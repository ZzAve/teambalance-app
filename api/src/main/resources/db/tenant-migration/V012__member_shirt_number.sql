-- The number a member plays under in this team (ADR-0038). Optional; unique among the team's current
-- members, which MemberService checks (NUMBER_TAKEN) rather than an index, for the fixture reason
-- ADR-0026 gives for display names.
ALTER TABLE member_profiles
    ADD COLUMN shirt_number SMALLINT NULL CHECK (shirt_number BETWEEN 0 AND 999);
