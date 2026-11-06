-- The language a person reads TeamBalance in (ADR-0043). On the user, not the device, so it follows
-- them everywhere and the API can pick the language of the emails it sends them.
--
-- NULL means "not chosen": the client then follows the device. Stored as the ISO 639-1 code.
ALTER TABLE users
    ADD COLUMN language VARCHAR(2) CHECK (language IN ('nl', 'en'));
