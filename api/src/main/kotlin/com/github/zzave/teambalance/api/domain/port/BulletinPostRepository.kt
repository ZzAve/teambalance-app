package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.NewPostContent
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant

/** The current tenant's Bulletin Board (ADR-0050). No method takes a team id: the routed schema is the team. */
interface BulletinPostRepository {
    /**
     * Pinned Posts first, then newest first, each with its edits. Without [includeHidden], only the
     * Posts a Member sees at [now]: not deleted, and not past their show-until.
     */
    fun list(includeHidden: Boolean, now: Instant): List<BulletinPost>

    fun create(post: NewPostContent, authorId: UserId, postedAt: Instant): BulletinPost

    /** Replaces the content and records the edit, together. Null when the Post is gone or deleted. */
    fun update(id: BulletinPostId, content: NewPostContent, editorId: UserId, editedAt: Instant): BulletinPost?

    /** Marks the Post deleted at [at]. False when it is gone or already deleted. */
    fun delete(id: BulletinPostId, at: Instant): Boolean

    /** Clears the delete. Null when the Post is not deleted or already removed. */
    fun restore(id: BulletinPostId): BulletinPost?

    /** Removes for good every Post deleted before [cutoff], with its edits. Returns how many. */
    fun removeDeletedBefore(cutoff: Instant): Int
}
