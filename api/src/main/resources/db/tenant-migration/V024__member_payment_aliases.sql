-- How a member appears on Bunq payments: a name, an IBAN or both (ADR-0045). Personal data; leaving the
-- team deletes the member's rows. Several rows per member. No foreign key to public.users, for the same
-- reason member_profiles has none.
--
-- A name is stored trimmed and an IBAN normalised (capitals, no spaces) by the application. Both are
-- unique within the team, the name without regard to case; the service maps a violation to 409.
CREATE TABLE member_payment_aliases (
    id      UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name    TEXT NULL,
    iban    TEXT NULL,
    CHECK (name IS NOT NULL OR iban IS NOT NULL)
);

CREATE INDEX member_payment_aliases_user_idx ON member_payment_aliases (user_id);
CREATE UNIQUE INDEX member_payment_aliases_name_key ON member_payment_aliases (lower(name));
CREATE UNIQUE INDEX member_payment_aliases_iban_key ON member_payment_aliases (iban);
