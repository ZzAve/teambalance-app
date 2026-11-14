// A Post on the Team's Bulletin Board (ADR-0048): Markdown written by an Admin, read by every Member. `authorId` is the user id of the Admin who posted it; the client resolves the name from the Roster, as it does for an attendance's `changedBy`.
type BulletinPost {
    id: String,
    markdown: String,
    authorId: String,
    postedAt: DateTimestampWithTimezone
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
