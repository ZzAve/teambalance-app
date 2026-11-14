-- The edit audit of a Bulletin Board Post (ADR-0048): who saved it and when, not the old text.
-- editor_id has no foreign key to public.users, like bulletin_posts.author_id.
CREATE TABLE bulletin_post_edits (
    id        BIGSERIAL PRIMARY KEY,
    post_id   UUID        NOT NULL REFERENCES bulletin_posts(id) ON DELETE CASCADE,
    editor_id UUID        NOT NULL,
    edited_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_bulletin_post_edits_post ON bulletin_post_edits (post_id);
