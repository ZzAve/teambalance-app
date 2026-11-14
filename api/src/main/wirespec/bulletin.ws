// One save of an existing Post: who and when, not the old text (ADR-0048).
type BulletinPostEdit {
    editorId: String,
    editedAt: DateTimestampWithTimezone
}

// A Post on the Team's Bulletin Board (ADR-0048): Markdown written by an Admin, read by every Member. `authorId` and `editorId` are user ids; the client resolves the names from the Roster, as it does for an attendance's `changedBy`. `edits` is oldest first, empty for a Post never edited.
type BulletinPost {
    id: String,
    markdown: String,
    authorId: String,
    postedAt: DateTimestampWithTimezone,
    edits: BulletinPostEdit[]
}

type BulletinPostList {
    posts: BulletinPost[]
}

// Newest first. Any Member may read the board.
endpoint ListBulletinPosts GET /api/bulletin-posts -> {
    200 -> BulletinPostList
}

// Admin-only. The Markdown is stored as written, trimmed; 400 when it is blank or longer than 5000 characters.
type CreateBulletinPostRequest {
    markdown: String
}

endpoint CreateBulletinPost POST CreateBulletinPostRequest /api/bulletin-posts -> {
    201 -> BulletinPost
    400 -> Unit
    403 -> Unit
}

// Admin-only. Replaces the Markdown, with the same rules as create, and records the edit. 404 when the Post is gone.
type UpdateBulletinPostRequest {
    markdown: String
}

endpoint UpdateBulletinPost PUT UpdateBulletinPostRequest /api/bulletin-posts/{id: String} -> {
    200 -> BulletinPost
    400 -> Unit
    403 -> Unit
    404 -> Unit
}
