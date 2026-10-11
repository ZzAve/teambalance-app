-- Beer Counter price (euro cents) and the team's bunq.me page for Top-ups; both optional.

ALTER TABLE money_pool_settings
    ADD COLUMN beer_price_cents INTEGER CHECK (beer_price_cents BETWEEN 1 AND 10000),
    ADD COLUMN bunq_me_link     TEXT;
