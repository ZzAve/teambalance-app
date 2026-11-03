-- A connection now always carries the grant and who connected it, and exists before the Admin has
-- picked an account (ADR-0042). Rows without a grant came from direct inserts, such as the dev demo
-- seed, and the OAuth flow never writes one.

DELETE FROM bunq_connection WHERE access_token_encrypted IS NULL OR connected_by IS NULL;

ALTER TABLE bunq_connection
    ALTER COLUMN access_token_encrypted SET NOT NULL,
    ALTER COLUMN connected_by SET NOT NULL,
    ALTER COLUMN bunq_account_id DROP NOT NULL;
