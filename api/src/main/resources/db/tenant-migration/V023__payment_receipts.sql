-- A picture of the receipt for an expense in the money pool, keyed by Bunq's payment id. The payment
-- itself stays in Bunq (ADR-0042); this is the one thing the app keeps per payment (ADR-0044).
-- Leaving out a foreign key is deliberate: there is no payments table to point at.
CREATE TABLE payment_receipts (
    payment_id TEXT        PRIMARY KEY,
    image      BYTEA       NOT NULL,
    version    TEXT        NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
