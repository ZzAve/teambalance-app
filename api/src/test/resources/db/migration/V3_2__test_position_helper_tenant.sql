-- Test-only helper, updated for tenant-owned positions (ADR-0025).
--
-- Replaces the V3_1 body rather than editing it, so a warm local database does not trip Flyway's
-- checksum validation on an already-applied migration.
--
-- It now writes BOTH sides, deliberately: the tenant tables the application reads, and the platform
-- tables it no longer reads. The platform write is kept only until the contract half of the move
-- drops those columns — specs still look positions up via `public.team_positions` to get an id, and
-- breaking every one of them is not this change's job. The SAME id is used on both sides, so a spec
-- that reads one and asserts against the other still agrees.
--
-- The tenant half is written into BOTH the team's declared schema_name AND current_schema() when
-- they differ, because the fixtures disagree about which is authoritative and this helper's job is
-- to make the member exist wherever the spec will look:
--   * `teams.schema_name` is UNIQUE, so only ONE test team can own `public` — yet many specs route
--     their requests there via the X-Team-Id shim whatever schema their team row claims. Those need
--     current_schema().
--   * specs that genuinely own a tenant schema (MemberControllerIT, PositionControllerIT) declare it
--     on the team row and route there. Those need schema_name.
-- Writing one and not the other leaves half the suite seeding into a schema nothing reads. Each
-- write is skipped when that schema has no `positions` table yet.
CREATE OR REPLACE FUNCTION public.tb_add_member(p_team uuid, p_user uuid, p_role text, p_label text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    v_pos     uuid;
    v_schemas text[];
    v_schema  text;
BEGIN
    SELECT ARRAY(
        SELECT DISTINCT s FROM unnest(ARRAY[
            (SELECT schema_name FROM public.teams WHERE id = p_team),
            current_schema()
        ]) AS s
        WHERE s IS NOT NULL
          AND EXISTS (
              SELECT 1 FROM information_schema.tables
              WHERE table_schema = s AND table_name = 'positions'
          )
    ) INTO v_schemas;

    IF p_label IS NOT NULL THEN
        -- Platform side first, because it mints the id the tenant copies keep.
        INSERT INTO public.team_positions (team_id, label) VALUES (p_team, p_label)
            ON CONFLICT (team_id, lower(label)) DO NOTHING;
        SELECT id INTO v_pos FROM public.team_positions
            WHERE team_id = p_team AND lower(label) = lower(p_label);
    END IF;

    INSERT INTO public.team_members (team_id, user_id, role, position_id)
        VALUES (p_team, p_user, p_role, v_pos)
        ON CONFLICT (team_id, user_id) DO NOTHING;

    IF p_label IS NOT NULL THEN
        FOREACH v_schema IN ARRAY v_schemas LOOP
            EXECUTE format(
                'INSERT INTO %I.positions (id, label) VALUES (%L, %L) ON CONFLICT DO NOTHING',
                v_schema, v_pos, p_label
            );
            -- Re-read per schema: a label already present there keeps ITS id, and the assignment has
            -- to point at the row that actually exists in that schema.
            EXECUTE format(
                'INSERT INTO %I.member_positions (user_id, position_id) ' ||
                'SELECT %L, id FROM %I.positions WHERE lower(label) = lower(%L) ' ||
                'ON CONFLICT (user_id) DO NOTHING',
                v_schema, p_user, v_schema, p_label
            );
        END LOOP;
    END IF;
END;
$$;
