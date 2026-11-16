// One save of an existing Post: who and when, not the old text (ADR-0050).
type BulletinPostEdit {
    editorId: String,
    editedAt: DateTimestampWithTimezone
}

// A Post on the Team's Bulletin Board (ADR-0050): Markdown written by an Admin, read by every Member. `authorId` and `editorId` are user ids; the client resolves the names from the Roster, as it does for an attendance's `changedBy`. `edits` is oldest first, empty for a Post never edited. `showUntil` is when Members stop seeing the Post; Admins still get it after that. `deletedAt` is set on a deleted Post, which only Admins see, until it is removed for good at `removedAt` (14 days later).
type BulletinPost {
    id: String,
    markdown: String,
    authorId: String,
    postedAt: DateTimestampWithTimezone,
    edits: BulletinPostEdit[],
    pinned: Boolean,
    showUntil: DateTimestampWithTimezone?,
    deletedAt: DateTimestampWithTimezone?,
    removedAt: DateTimestampWithTimezone?
}

type BulletinPostList {
    posts: BulletinPost[]
}

// Pinned Posts first, then newest first. Any Member may read the board; Admins also get the Posts past their `showUntil` and the deleted Posts that can still be restored.
endpoint ListBulletinPosts GET /api/bulletin-posts -> {
    200 -> BulletinPostList
}

// Admin-only. The Markdown is stored as written, trimmed; 400 when it is blank or longer than 5000 characters.
type CreateBulletinPostRequest {
    markdown: String,
    pinned: Boolean,
    showUntil: DateTimestampWithTimezone?
}

endpoint CreateBulletinPost POST CreateBulletinPostRequest /api/bulletin-posts -> {
    201 -> BulletinPost
    400 -> Unit
    403 -> Unit
}

// Admin-only. Replaces the Markdown, the pin and `showUntil` (null clears it), with the same rules as create, and records the edit. 404 when the Post is gone or deleted.
type UpdateBulletinPostRequest {
    markdown: String,
    pinned: Boolean,
    showUntil: DateTimestampWithTimezone?
}

endpoint UpdateBulletinPost PUT UpdateBulletinPostRequest /api/bulletin-posts/{id: String} -> {
    200 -> BulletinPost
    400 -> Unit
    403 -> Unit
    404 -> Unit
}

// Admin-only. Hides the Post from Members at once; it can be restored for 14 days, then it is removed for good. 404 when the Post is gone or already deleted.
endpoint DeleteBulletinPost DELETE /api/bulletin-posts/{id: String} -> {
    204 -> Unit
    403 -> Unit
    404 -> Unit
}

// Admin-only. Shows a deleted Post again, with its text and edits. 404 when it is not deleted or already removed.
endpoint RestoreBulletinPost POST /api/bulletin-posts/{id: String}/restore -> {
    200 -> BulletinPost
    403 -> Unit
    404 -> Unit
}
