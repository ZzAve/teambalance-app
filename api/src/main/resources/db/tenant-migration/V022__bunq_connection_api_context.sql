-- The Bunq API session of a connection (installation, device and session), kept encrypted so that it is set up once
-- per connection and not on every read: Bunq limits setting one up to about ten times a day. It belongs to the grant
-- in the same row and is dropped with it when the Admin connects again. Optional: a connection made before this
-- migration has none, and the first read after it sets one up and stores it.

ALTER TABLE bunq_connection
    ADD COLUMN api_context_encrypted TEXT;
