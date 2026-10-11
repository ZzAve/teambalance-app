-- The Bunq connection now holds the OAuth grant (ADR-0042). Until the Admin picks one of the grant's
-- accounts there is a connection without an account, so bunq_account_id becomes optional.
--
-- Rows written before this migration came from a seed and carry no grant, so they are dropped rather
-- than given a placeholder grant.

DELETE FROM bunq_connection;

ALTER TABLE bunq_connection
    ALTER COLUMN bunq_account_id DROP NOT NULL,
    ADD COLUMN access_token_encrypted TEXT NOT NULL,
    ADD COLUMN connected_by           UUID NOT NULL;
