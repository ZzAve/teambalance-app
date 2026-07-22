-- Replace the free-text team_members.team_role with a per-team POSITION vocabulary (ADR-0013).
-- Positions live in the platform (public) schema, keyed by team, and members reference one by id.

CREATE TABLE public.team_positions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id    UUID         NOT NULL REFERENCES teams(id),
    label      VARCHAR(50)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Per-team labels are unique case-insensitively ("Setter" and "setter" cannot coexist in one team).
CREATE UNIQUE INDEX uq_team_positions_team_label ON public.team_positions (team_id, lower(label));

ALTER TABLE public.team_members ADD COLUMN position_id UUID NULL REFERENCES team_positions(id);

-- Backfill: promote each team's distinct non-null team_role to a position, then point members at it.
INSERT INTO public.team_positions (team_id, label)
SELECT DISTINCT team_id, team_role
FROM   public.team_members
WHERE  team_role IS NOT NULL;

UPDATE public.team_members tm
SET    position_id = tp.id
FROM   public.team_positions tp
WHERE  tp.team_id = tm.team_id
  AND  lower(tp.label) = lower(tm.team_role)
  AND  tm.team_role IS NOT NULL;

ALTER TABLE public.team_members DROP COLUMN team_role;
