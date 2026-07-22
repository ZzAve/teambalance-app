-- One-time onboarding state: when a member completes the /welcome flow we stamp onboarded_at.
-- NULL means the member has not yet onboarded, so the SPA routes them to /welcome.
ALTER TABLE public.team_members ADD COLUMN onboarded_at TIMESTAMPTZ NULL;
