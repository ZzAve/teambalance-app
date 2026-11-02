-- Substitutes (ADR-0033): people outside the Team whom the Team keeps on a list and calls in for an
-- Event. Not Members, so nothing here touches public.team_members or the attendances table: a
-- Substitute has no account, and every rule stated in terms of Members stays as it is.
--
-- position_id ON DELETE SET NULL for the same reason as member_profiles: deleting a Position leaves
-- the person in place and merely unassigns them.
CREATE TABLE substitutes (
    id          UUID PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    position_id UUID NULL REFERENCES positions(id) ON DELETE SET NULL,
    created_by  UUID         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- A Substitute is on an Event exactly when they have a row here, so NOT_RESPONDED is not a state a
-- row can hold: they are never expected to answer. Both foreign keys cascade: deleting the Event or
-- removing the Substitute from the list takes their attendance with it, the same rule as a departed
-- Member (ADR-0009).
CREATE TABLE substitute_attendances (
    id            BIGSERIAL PRIMARY KEY,
    event_id      BIGINT      NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    substitute_id UUID        NOT NULL REFERENCES substitutes(id) ON DELETE CASCADE,
    state         VARCHAR(20) NOT NULL,
    changed_by    UUID        NOT NULL,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (event_id, substitute_id),
    CONSTRAINT substitute_attendance_state CHECK (state IN ('ATTENDING', 'MAYBE', 'ABSENT'))
);

CREATE INDEX idx_substitute_attendances_substitute ON substitute_attendances (substitute_id);
