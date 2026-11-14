-- Posts on the Team's Bulletin Board (ADR-0048). author_id has no foreign key to public.users, like
-- member_profiles: a Post stays when its author leaves the Team.
CREATE TABLE bulletin_posts (
    id        UUID PRIMARY KEY,
    markdown  TEXT        NOT NULL,
    author_id UUID        NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL
);
