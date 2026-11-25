-- An expense a member paid for the team with their own money (ADR-0048). It is not a Bunq payment, so the
-- app is its only record. The money pool shows it as an expense that also counts as a contribution of
-- paid_by. No foreign key to public.users, for the same reason member_profiles has none: the row stays
-- when the member leaves.
CREATE TABLE out_of_pocket_expenses (
    id           UUID        PRIMARY KEY,
    paid_by      UUID        NOT NULL,
    amount_cents BIGINT      NOT NULL CHECK (amount_cents > 0),
    paid_on      DATE        NOT NULL,
    description  TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX out_of_pocket_expenses_paid_on_idx ON out_of_pocket_expenses (paid_on);
