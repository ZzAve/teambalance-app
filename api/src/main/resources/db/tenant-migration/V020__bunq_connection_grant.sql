-- The Bunq connection holds the Admin's OAuth grant, encrypted (ADR-0042), and who connected it.
-- Both are nullable: a row inserted directly, such as the dev demo seed, has neither, and the fake
-- Bunq reads need no grant. The OAuth flow always writes both.

ALTER TABLE bunq_connection
    ADD COLUMN access_token_encrypted TEXT,
    ADD COLUMN connected_by           UUID;
