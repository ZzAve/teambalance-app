package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant

/** The current tenant's Bulletin Board (ADR-0048). No method takes a team id: the routed schema is the team. */
interface BulletinPostRepository {
    /** Every Post, newest first. */
    fun list(): List<BulletinPost>

    fun create(markdown: PostMarkdown, authorId: UserId, postedAt: Instant): BulletinPost
}
