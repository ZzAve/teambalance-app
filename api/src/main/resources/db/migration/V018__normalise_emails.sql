-- Emails are stored trimmed and lowercased (#174), so differently-cased forms of one address are one user.
-- Users whose addresses become equal under that rule are two accounts for one person; merging them is a
-- manual decision, so the migration stops and names the addresses instead. It stops the same way for an
-- address that is not of the form name@domain, which the application would no longer read back.
-- Tables are unqualified on purpose: Flyway sets search_path to public, and NormaliseEmailsMigrationIT
-- runs this file against a scratch schema.
DO $$
DECLARE
    malformed  TEXT;
    collisions TEXT;
BEGIN
    SELECT string_agg(quote_literal(email), ', ' ORDER BY email) INTO malformed
    FROM users
    WHERE lower(trim(email)) !~ '^[^@]+@[^@]+$';

    IF malformed IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot normalise users.email: these addresses are not of the form name@domain: %. Correct or remove those users, then rerun.', malformed;
    END IF;

    SELECT string_agg(normalised, ', ' ORDER BY normalised) INTO collisions
    FROM (
        SELECT lower(trim(email)) AS normalised
        FROM users
        GROUP BY lower(trim(email))
        HAVING count(*) > 1
    ) duplicates;

    IF collisions IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot normalise users.email: these addresses belong to more than one user once trimmed and lowercased: %. Merge or rename those users, then rerun.', collisions;
    END IF;
END $$;

UPDATE users SET email = lower(trim(email)) WHERE email <> lower(trim(email));
UPDATE magic_link_tokens SET email = lower(trim(email)) WHERE email <> lower(trim(email));
