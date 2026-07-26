-- Phase 2 of recurring events (ADR-0014): occurrences of a series share a recurring_group UUID.
-- The events table already ships the (nullable) recurring_group column; this indexes it so the
-- "part of a series" lookups (fetch siblings of an occurrence) don't table-scan. Partial index —
-- single (non-recurring) events leave the column NULL and need no index entry.

CREATE INDEX idx_events_recurring_group ON events(recurring_group) WHERE recurring_group IS NOT NULL;
