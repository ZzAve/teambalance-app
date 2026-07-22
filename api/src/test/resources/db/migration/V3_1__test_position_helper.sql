-- Test-only helper (runs after V003, so team_positions exists). Lets IT specs seed a member with an
-- optional position label in one call, reusing a team's existing position when the label repeats —
-- so tests that put two members on the same position share one row without tripping the unique index.
CREATE OR REPLACE FUNCTION public.tb_add_member(p_team uuid, p_user uuid, p_role text, p_label text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_pos uuid;
BEGIN
    IF p_label IS NOT NULL THEN
        INSERT INTO public.team_positions (team_id, label) VALUES (p_team, p_label)
            ON CONFLICT (team_id, lower(label)) DO NOTHING;
        SELECT id INTO v_pos FROM public.team_positions
            WHERE team_id = p_team AND lower(label) = lower(p_label);
    END IF;
    INSERT INTO public.team_members (team_id, user_id, role, position_id)
        VALUES (p_team, p_user, p_role, v_pos)
        ON CONFLICT (team_id, user_id) DO NOTHING;
END;
$$;
